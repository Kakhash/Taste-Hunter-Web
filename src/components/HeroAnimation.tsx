import { motion } from 'framer-motion';
export default function HeroAnimation({ onDone }: { onDone: () => void }) {
  return (
    <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-thmint">
      <motion.div className="absolute inset-0">
        <motion.div className="text-[100px] md:text-[140px] absolute left-8 top-1/2 -translate-y-1/2" initial={{x:-200}} animate={{x:0}} transition={{duration:1.2}}>🍔</motion.div>
        <motion.div className="text-[100px] md:text-[140px] absolute right-8 top-1/2 -translate-y-1/2" initial={{x:200}} animate={{x:0}} transition={{duration:1.2}}>🍕</motion.div>
        <motion.div className="absolute inset-0" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.3,duration:0.2}}>
          <motion.div className="text-[100px] md:text-[140px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" initial={{scale:0.8}} animate={{scale:[0.8,1.1,0.9,1]}} transition={{times:[0,0.3,0.6,1], duration:0.8, delay:1.5}}>🍔😋🍕</motion.div>
        </motion.div>
      </motion.div>
      <motion.div className="absolute bottom-12 md:bottom-20 text-center" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:2.6,duration:0.6}} onAnimationComplete={onDone}>
        <div className="text-4xl md:text-6xl font-extrabold tracking-tight text-thred">TASTE HUNTER <span className="font-black">BISTRO</span></div>
        <div className="mt-2 text-slate-700 text-sm md:text-base">Burgers · Pizza · Street Food</div>
      </motion.div>
    </div>
  );
}
