import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MetricCard } from "./MetricCard";
import { Sidebar } from "./Sidebar";
import { Users, Utensils } from "lucide-react";


export const Dashboard = () => {
  const navigate = useNavigate();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMeals, setTotalMeals] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, mealsRes] = await Promise.all([
          fetch("http://localhost:3000/students/count"),
          fetch("http://localhost:3000/meallog/count")
        ]);

        const studentsData = await studentsRes.json();
        const mealsData = await mealsRes.json();

        setTotalStudents(studentsData.totalStudents || 0);
        setTotalMeals(mealsData.totalMeals || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStudentsClick = () => {
    navigate("/students");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's your hostel overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <MetricCard
            title="Total Students"
            value={loading ? 0 : totalStudents}
            icon={Users}
            color="students"
            subtitle="Active enrollment"
            onAction={handleStudentsClick}
          />
          <MetricCard
            title="Total Meals"
            value={loading ? 0 : totalMeals}
            icon={Utensils}
            color="feedback"
            subtitle="Meals served"
          />
        </div>
      </main>
    </div>
  );
};