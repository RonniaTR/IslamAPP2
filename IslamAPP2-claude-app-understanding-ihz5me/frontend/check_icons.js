const lucide = require('lucide-react');
console.log('version:', require('lucide-react/package.json').version);
const icons = ['BookOpen','Volume2','Moon','Compass','Heart','Share2','ChevronRight','Check','Users','Copy','Play','Pause','Loader','Search','Youtube','X','ArrowLeft','ChevronDown','BookMarked','Loader2','Sparkles','Send','Trash2','MessageCircle','Star','ArrowRight','RotateCw','Crown','Timer','Clock','Scroll','Sunrise','Scale','Building','Award','Target','Flame','Trophy','Zap','MapPin','Navigation','Download','Home','Settings','ScrollText','BookmarkPlus','CheckCircle2','Waves','User','Mic','MicOff','Globe','Languages','Bell','BellOff','LogOut','Sun','RefreshCw'];
icons.forEach(function(i) {
  if (lucide[i] === undefined) console.log('MISSING:', i);
});
console.log('Done checking', icons.length, 'icons');
