export interface ExpandableButtonProps {
  type: string;
  explanation: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}
