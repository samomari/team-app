import { Button } from "@/components/ui/button";
import { Lock, Trash, Unlock } from "lucide-react";

type ToolbarProps = {
  onDelete: () => void;
  onBlock: () => void;
  onUnblock: () => void;
};

export default function Toolbar({
  onDelete,
  onBlock,
  onUnblock,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-sm rounded-lg">
      <div className="flex space-x-2">
        <Button
          onClick={onBlock}
          variant="outline"
          className="flex items-center space-x-2 text-blue-600"
        >
          <Lock className="w-4 h-4" />
          <span>Block</span>
        </Button>
        <Button
          onClick={onUnblock}
          variant="outline"
          className="flex items-center space-x-2 text-blue-600"
        >
          <Unlock className="w-4 h-4" />
          <span>Unblock</span>
        </Button>
        <Button
          onClick={onDelete}
          variant="destructive"
          className="flex items-center space-x-2"
        >
          <Trash className="w-4 h-4" />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
}
