import { Button } from '@/components/ui/button';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ExportButtonProps {
  onExportPDF?: () => void;
  onExportCSV?: () => void;
  onExportExcel?: () => void;
  className?: string;
}

/**
 * Dumb Component: Export-Button mit Dropdown-Menü
 */
export const ExportButton = ({
  onExportPDF,
  onExportCSV,
  onExportExcel,
  className,
}: ExportButtonProps) => {
  const handleExport = (type: 'pdf' | 'csv' | 'excel') => {
    switch (type) {
      case 'pdf':
        onExportPDF?.();
        break;
      case 'csv':
        onExportCSV?.();
        break;
      case 'excel':
        onExportExcel?.();
        break;
    }
    toast.success(`Export als ${type.toUpperCase()} gestartet`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <Download className="h-4 w-4 mr-2" />
          Bericht exportieren
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 mr-2" />
          Als PDF exportieren
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <Table className="h-4 w-4 mr-2" />
          Als CSV exportieren
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Als Excel exportieren
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
