import { AnimatePresence, motion } from 'framer-motion';
export default function ImageModal({ open, onClose, src, alt }:{open:boolean;onClose:()=>void;src:string;alt:string;}){
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
          <motion.img onClick={(e)=>e.stopPropagation()} src={src} alt={alt} className="max-h-[85vh] max-w-[95vw] rounded-2xl shadow-lg" initial={{scale:0.85}} animate={{scale:1}} exit={{scale:0.85}}/>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
