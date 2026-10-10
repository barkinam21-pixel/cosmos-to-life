/* Lightweight stereo-side plus mono-spectrum soundtrack recovery.
   No external AI, network calls or heavy FFT. Midrange speech is attenuated,
   but a mixed mono soundtrack cannot be separated perfectly. */
class HebrewDubCapture extends AudioWorkletProcessor {
  constructor(){
    super();
    this.phase=0;this.sum=0;this.samples=0;
    this.sampleIndex=0;this.packet=new Int16Array(1600);
    this.inputRate=sampleRate;
    this.bass=0;this.trebleLowpass=0;
    this.bassAlpha=1-Math.exp(-2*Math.PI*175/sampleRate);
    this.trebleAlpha=1-Math.exp(-2*Math.PI*4250/sampleRate);
  }
  process(inputs,outputs){
    const channels=inputs[0]||[];
    const left=channels[0],right=channels[1];
    const out=outputs[0]||[];
    const outLeft=out[0],outRight=out[1];
    if(left){
      for(let i=0;i<left.length;i++){
        const l=left[i],r=right?right[i]:l;
        const mid=(l+r)*0.5;
        const side=right?l-r:0;
        this.bass+=this.bassAlpha*(mid-this.bass);
        this.trebleLowpass+=this.trebleAlpha*(mid-this.trebleLowpass);
        const treble=mid-this.trebleLowpass;
        const sound=Math.max(-1,Math.min(1,0.75*side+0.60*this.bass+0.18*treble));
        if(outLeft)outLeft[i]=sound;
        if(outRight)outRight[i]=sound;
        this.sum+=mid;this.samples++;
        this.phase+=16000;
        if(this.phase>=this.inputRate){
          this.phase-=this.inputRate;
          const v=Math.max(-1,Math.min(1,this.sum/this.samples));
          this.packet[this.sampleIndex++]=v<0?v*32768:v*32767;
          this.sum=0;this.samples=0;
          if(this.sampleIndex===1600){
            this.port.postMessage(this.packet.buffer,[this.packet.buffer]);
            this.packet=new Int16Array(1600);
            this.sampleIndex=0;
          }
        }
      }
    }else{
      if(outLeft)outLeft.fill(0);
      if(outRight)outRight.fill(0);
    }
    return true;
  }
}
registerProcessor('hebrew-dub-capture',HebrewDubCapture);
