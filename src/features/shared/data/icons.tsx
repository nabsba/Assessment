import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiGitBranch,
  FiHome,
  FiLink,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiMenu,
  FiSearch,
  FiSettings,
  FiStar,
  FiTrash2,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from 'react-icons/fa'
import StackIcon from '../components/icons/StackIcon';
import { StackIconEmpty } from '../components/icons/StackIconEmpty';
import { DuplicateIcon } from '../components/icons/DuplicateIcon';
import { TrashIcon } from '../components/icons/TrashIcon';


// Create a SearchWithBadge component


export const ICON_MAP = {
  // Navigation
  search: FiSearch,
  stackIcon: StackIcon, 
  stackIconEmpty: StackIconEmpty, 
  user: FiUser,
  home: FiHome,
  menu: FiMenu,
  close: FiX,
  chevronRight: FiChevronRight,
  chevronLeft: FiChevronLeft,

  // Actions - choose your preferred style
  star: FiStar,
  bin: TrashIcon,           // Feather style
  // bin: AiOutlineDelete, // Ant Design style
  duplicate: DuplicateIcon,       // Feather style  
  // duplicate: AiOutlineCopy, // Ant Design style
  link: FiLink,
  settings: FiSettings,
  logout: FiLogOut,

  // Content
  branch: FiGitBranch,
  calendar: FiCalendar,
  location: FiMapPin,
  email: FiMail,

  // Social
  github: FaGithub,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  globe: FaGlobe,
} as const;

// Icon sizes
export const ICON_SIZES = {
  xs: '16px',
  sm: '20px',
  md: '24px',
  lg: '32px',
  xl: '40px',
} as const;