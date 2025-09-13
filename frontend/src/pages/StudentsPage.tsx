import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StudentForm } from "@/components/StudentForm";
import { Sidebar } from "@/components/Sidebar";
import { Users, Plus } from "lucide-react";

export const StudentsPage = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchStudentsCount = async () => {
      try {
        const res = await fetch("http://localhost:3000/students/count");
        const data = await res.json();
        setTotalStudents(data.totalStudents || 0);
      } catch (error) {
        console.error("Error fetching students count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsCount();
  }, []);

  const handleStudentCreated = () => {
    setIsDialogOpen(false);
    // Refresh the count
    const fetchStudentsCount = async () => {
      try {
        const res = await fetch("http://localhost:3000/students/count");
        const data = await res.json();
        setTotalStudents(data.totalStudents || 0);
      } catch (error) {
        console.error("Error fetching students count:", error);
      }
    };
    fetchStudentsCount();
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Students Management</h2>
          <p className="text-muted-foreground">Manage student registrations and information.</p>
        </div>

        <div className="max-w-md">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="bg-students text-students-foreground p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 opacity-90" />
                <div className="text-right">
                  <div className="text-3xl font-bold leading-none">
                    {loading ? "..." : totalStudents}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 mb-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide opacity-90">
                  Total Students
                </h3>
                <p className="text-xs opacity-75">Active enrollment</p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-current hover:bg-current/10 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Student</DialogTitle>
                  </DialogHeader>
                  <StudentForm onSuccess={handleStudentCreated} />
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};