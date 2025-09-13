import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "students" | "rooms" | "courses" | "complaints-registered" | "complaints-new" | "complaints-process" | "complaints-closed" | "feedback";
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

const colorClasses = {
  students: "bg-students text-students-foreground",
  rooms: "bg-rooms text-rooms-foreground", 
  courses: "bg-courses text-courses-foreground",
  "complaints-registered": "bg-complaints-registered text-complaints-foreground",
  "complaints-new": "bg-complaints-new text-complaints-foreground",
  "complaints-process": "bg-complaints-process text-complaints-foreground",
  "complaints-closed": "bg-complaints-closed text-complaints-foreground",
  feedback: "bg-feedback text-feedback-foreground"
};

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle, 
  actionText = "Full Details",
  onAction 
}: MetricCardProps) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 group">
      <div className={cn("p-6 relative", colorClasses[color])}>
        <div className="flex items-center justify-between mb-4">
          <Icon className="h-8 w-8 opacity-90" />
          <div className="text-right">
            <div className="text-3xl font-bold leading-none">{value}</div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-semibold text-sm uppercase tracking-wide opacity-90">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs opacity-75">{subtitle}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-current/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAction}
            className="text-current hover:bg-current/10 p-0 h-auto font-medium text-xs group-hover:translate-x-1 transition-transform duration-200"
          >
            {actionText}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-current/5 rounded-full -translate-y-10 translate-x-10" />
      </div>
    </Card>
  );
};