/* Low-cost stereo soundfield + mono-safe frequency-band background recovery.
   Translation always receives original mono PCM; only local playback is filtered.
   This cannot fully separate English speech from music in mixed audio. */
class HebrewDubCapture extends AudioWorkletProcessor {
  constructor(){
    super();
    this.phase=0;this.sum=0;this.samples=0;this.sampleIndex=0;
    this.packet=new Int16Array(1600);this.inputRate=sampleRate;
    this.lowA=1-Math.exp(-2*Math.PI*180/sampleRate);
    this.highA=Math.exp(-2*Math.PI*3600/sampleRate);
    this.low1=0;this.low2=0;this.hi1=0;this.hi2=0;
    this.lastMid=0;this.lastHi1=0;
    this.meterSamples=0;this.rawSquare=0;this.backgroundSquare=0;this.sideSquare=0;
  }
  process(inputs,outputs){
    const channels=inputs[0]||[];
    const left=channels[0],right=channels[1];
    const out=outputs[0]||[],outLeft=out[0],outRight=out[1];
    if(!left){if(outLeft)outLeft.fill(0);if(outRight)outRight.fill(0);return true}
    const stereo=!!right;
    for(let i=0;i<left.length;i++){
      const l=left[i],r=stereo?right[i]:l;
      const mid=(l+r)*0.5,side=stereo?(l-r)*0.5:0;
      // Recover music bass and high-frequency effects also when input is mono.
      this.low1+=this.lowA*(mid-this.low1);
      this.low2+=this.lowA*(this.low1-this.low2);
      this.hi1=this.highA*(this.hi1+mid-this.lastMid);
      this.hi2=this.highA*(this.hi2+this.hi1-this.lastHi1);
      this.lastMid=mid;this.lastHi1=this.hi1;
      // Keep stereo effects on their respective sides instead of flattening
      // everything to two copies of the left side; mono remains supported.
      const common=1.3*this.low2+0.85*this.hi2;
      const stereoSide=1.1*side;
      const bgLeft=Math.max(-1,Math.min(1,common+stereoSide));
      const bgRight=Math.max(-1,Math.min(1,common-stereoSide));
      if(outLeft)outLeft[i]=bgLeft;
      if(outRight)outRight[i]=bgRight;
      this.rawSquare+=mid*mid;
      this.backgroundSquare+=0.5*(bgLeft*bgLeft+bgRight*bgRight);
      this.sideSquare+=side*side;
      this.meterSamples++;
      if(this.meterSamples>=this.inputRate){
        const n=this.meterSamples;
        this.port.postMessage({type:'soundLevels',channels:stereo?2:1,
          sourceRms:Math.sqrt(this.rawSquare/n),backgroundRms:Math.sqrt(this.backgroundSquare/n),
          sideRms:Math.sqrt(this.sideSquare/n)});
        this.meterSamples=0;this.rawSquare=0;this.backgroundSquare=0;this.sideSquare=0;
      }
      // 16kHz translation input remains original downmixed audio.
      this.sum+=mid;this.samples++;this.phase+=16000;
      if(this.phase>=this.inputRate){
        this.phase-=this.inputRate;
        const v=Math.max(-1,Math.min(1,this.sum/this.samples));
        this.packet[this.sampleIndex++]=v<0?v*32768:v*32767;
        this.sum=0;this.samples=0;
        if(this.sampleIndex===1600){
          this.port.postMessage(this.packet.buffer,[this.packet.buffer]);
          this.packet=new Int16Array(1600);this.sampleIndex=0;
        }
      }
    }
    return true;
  }
}
registerProcessor('hebrew-dub-capture',HebrewDubCapture);
