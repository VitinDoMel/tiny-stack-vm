import{mkdirSync as M,readdirSync as R,readFileSync as F,writeFileSync as W}from'node:fs';

const T=new Uint8Array(256);
for(let i=16;i<35;i++)T[i]=97;
for(const[o,m]of[[0,1],[1,67],[2,73],[3,17],[4,145],[5,161],[6,225],[7,241],[23,81],[27,81],[31,0],[48,5],[49,21],[50,21],[51,5],[52,1],[64,81],[65,33],[80,17],[81,17],[82,65],[83,17]])T[o]=m;

function run(p,inp){
  const n=p.length,D=new Int32Array(256),C=new Int32Array(64),A=new Int32Array(256),O=new Uint8Array(65536);
  let sp=0,cp=0,ol=0,ip=0,pc=0,st=0,t=0;
  const end=(c)=>[O.subarray(0,ol),c];
  for(;;){
    if(st===1e6)return end(10);
    if(pc>>>0>=n)return end(9);
    const op=p[pc],m=T[op];
    if(!m)return end(5);
    const imm=(m>>1)&7;
    if(pc+imm>=n)return end(9);
    st++;
    const pop=(m>>4)&3,push=(m>>6)&3,nx=pc+1+imm;
    if(sp<pop)return end(2);
    if(sp-pop+push>256)return end(3);
    pc=nx;
    if(op>=16&&op<35&&op!==23&&op!==27){
      const b=D[--sp],a=D[sp-1];
      if(op>18&&op<23&&!b)return end(4);
      D[sp-1]=op===16?a+b:op===17?a-b:op===18?Math.imul(a,b):op===19?(a===-2147483648&&b===-1?a:a/b):op===20?(b===-1?0:a%b):op===21?(a>>>0)/(b>>>0):op===22?(a>>>0)%(b>>>0):op===24?a&b:op===25?a|b:op===26?a^b:op===28?a<<b:op===29?a>>b:op===30?a>>>b:op===32?+(a===b):op===33?+(a<b):+((a>>>0)<(b>>>0));
      continue;
    }
    if(op>47&&op<51){
      if(op===48||(op===49?!D[--sp]:D[--sp]))pc=nx+(((p[nx-2]|p[nx-1]<<8)<<16)>>16);
      continue;
    }
    if(op===64||op===65){
      const k=D[sp-1];
      if(k>>>8)return end(6);
      if(op===64)D[sp-1]=A[k];
      else{A[k]=D[sp-2];sp-=2;}
      continue;
    }
    switch(op){
      case 0:return end(0);
      case 1:D[sp++]=(p[nx-1]<<24)>>24;break;
      case 2:D[sp++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
      case 3:sp--;break;
      case 4:D[sp]=D[sp-1];sp++;break;
      case 5:t=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=t;break;
      case 6:D[sp]=D[sp-2];sp++;break;
      case 7:t=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=t;break;
      case 23:D[sp-1]=-D[sp-1];break;
      case 27:D[sp-1]=~D[sp-1];break;
      case 51:if(cp===64)return end(7);C[cp++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
      case 52:if(!cp)return end(8);pc=C[--cp];break;
      case 80:{const b=Buffer.from(''+D[sp-1]);if(ol+b.length>65536)return end(11);sp--;O.set(b,ol);ol+=b.length;break;}
      case 81:if(ol>>16)return end(11);O[ol++]=D[--sp]&255;break;
      case 82:D[sp++]=ip<inp.length?inp[ip++]:-1;break;
      case 83:return end(D[--sp]&255);
    }
  }
}

const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of R(I).sort()){
  const[o,c]=run(F(`${I}/${id}/program.bin`),F(`${I}/${id}/input.bin`));
  M(`${O}/${id}`,{recursive:true});
  W(`${O}/${id}/stdout.bin`,o);
  W(`${O}/${id}/exit.txt`,`${c}\n`);
}
