/* Audio-only 16 kHz PCM capture, no video frames transmitted. */
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
    const channel=inputs[0]?.[0];
    if(channel){
      for(let i=0;i<channel.length;i++){
        this.sum+=channel[i];this.samples++;
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
    }
    for(const out of outputs){for(const c of out)c.fill(0)}
    return true;
  }
}
registerProcessor('hebrew-dub-capture',HebrewDubCapture);
