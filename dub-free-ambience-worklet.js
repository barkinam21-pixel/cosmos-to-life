/* Filtered background soundtrack for the optional no-key dubbing route.
   Reuses the existing low/mid/high and stereo-side mix, but deliberately
   avoids allocating 16 kHz PCM packets or posting them 10 times/second.
   Google Live retains its original, unchanged dub-worklet.js. */
class HebrewDubAmbience extends AudioWorkletProcessor {
  constructor(){
    super();
    this.inputRate=sampleRate;
    this.lowA=1-Math.exp(-2*Math.PI*190/sampleRate);
    this.highA=Math.exp(-2*Math.PI*3600/sampleRate);
    this.low1=0;this.hi1=0;this.lastMid=0;
    this.meterSamples=0;this.rawSquare=0;this.backgroundSquare=0;this.sideSquare=0;
  }
  process(inputs,outputs){
    const channels=inputs[0]||[];
    const left=channels[0],right=channels[1];
    const out=outputs[0]||[],outLeft=out[0],outRight=out[1];
    if(!left){
      if(outLeft)outLeft.fill(0);
      if(outRight)outRight.fill(0);
      return true;
    }
    const stereo=!!right;
    for(let i=0;i<left.length;i++){
      const l=left[i],r=stereo?right[i]:l;
      const mid=(l+r)*0.5,side=stereo?(l-r)*0.5:0;
      this.low1+=this.lowA*(mid-this.low1);
      this.hi1=this.highA*(this.hi1+mid-this.lastMid);
      this.lastMid=mid;
      const speechAndMelody=mid-this.low1-this.hi1;
      const common=1.15*this.low1+this.hi1+0.10*speechAndMelody;
      const bgLeft=Math.max(-1,Math.min(1,common+side));
      const bgRight=Math.max(-1,Math.min(1,common-side));
      if(outLeft)outLeft[i]=bgLeft;
      if(outRight)outRight[i]=bgRight;
      this.rawSquare+=mid*mid;
      this.backgroundSquare+=0.5*(bgLeft*bgLeft+bgRight*bgRight);
      this.sideSquare+=side*side;
      this.meterSamples++;
      if(this.meterSamples>=this.inputRate){
        const n=this.meterSamples;
        this.port.postMessage({type:'soundLevels',channels:stereo?2:1,
          sourceRms:Math.sqrt(this.rawSquare/n),
          backgroundRms:Math.sqrt(this.backgroundSquare/n),
          sideRms:Math.sqrt(this.sideSquare/n)});
        this.meterSamples=0;this.rawSquare=0;this.backgroundSquare=0;this.sideSquare=0;
      }
    }
    return true;
  }
}
registerProcessor('hebrew-dub-ambience',HebrewDubAmbience);
