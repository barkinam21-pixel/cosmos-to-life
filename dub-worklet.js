/* Low-cost stereo background recovery + audio-only 16kHz PCM capture.
   Translation still receives mono source speech. The background is local-only.
   Only the L-R side channel survives: mono audio and centered effects vanish. */
class HebrewDubCapture extends AudioWorkletProcessor {
  constructor(){
    super();
    this.phase=0;
    this.sum=0;
    this.samples=0;
    this.sampleIndex=0;
    this.packet=new Int16Array(1600);
    this.inputRate=sampleRate;
  }
  process(inputs,outputs){
    const channels=inputs[0]||[];
    const left=channels[0],right=channels[1];
    const out=outputs[0]||[];
    const outLeft=out[0],outRight=out[1];
    if(left){
      for(let i=0;i<left.length;i++){
        const l=left[i],r=right?right[i]:l;
        // Subtract stereo channels to reduce center-panned English dialogue.
        // Keep the recovered side signal in phase on both speakers/headphones.
        const side=right?Math.max(-1,Math.min(1,l-r)):0;
        if(outLeft)outLeft[i]=side;
        if(outRight)outRight[i]=side;
        // Downmix BOTH stereo channels for accurate translation input.
        this.sum+=(l+r)*0.5;this.samples++;
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
