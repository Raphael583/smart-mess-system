import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Scan, User, Building, Phone, Mail, Utensils, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StudentData {
  name: string;
  deptNo: string;
  year: number;
  phoneNumber: string;
  email: string;
  messType: string;
  roomNumber: string;
  rfidUID: string;
}

interface StudentFormProps {
  onSuccess?: () => void;
}

export const StudentForm = ({ onSuccess }: StudentFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<StudentData>({
    name: "",
    deptNo: "",
    year: 1,
    phoneNumber: "",
    email: "",
    messType: "Veg",
    roomNumber: "",
    rfidUID: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [scanningRFID, setScanningRFID] = useState(false);

  const handleInputChange = (field: keyof StudentData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const scanRFID = async () => {
    setScanningRFID(true);
    try {
      const res = await fetch("http://localhost:3000/rfid/get");
      const data = await res.json();

      if (data.uid) {
        handleInputChange("rfidUID", data.uid);
        toast({
          title: "RFID Scanned Successfully",
          description: `RFID UID: ${data.uid}`,
        });
      } else {
        toast({
          title: "RFID Scan Failed",
          description: data.message || "No RFID available!",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "RFID Scan Failed",
        description: "Error fetching RFID!",
        variant: "destructive",
      });
    } finally {
      setScanningRFID(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rfidUID) {
      toast({
        title: "RFID Required",
        description: "Please scan RFID before creating student",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Student Created Successfully",
          description: `${formData.name} has been registered`,
        });
        
        // Reset form
        setFormData({
          name: "",
          deptNo: "",
          year: 1,
          phoneNumber: "",
          email: "",
          messType: "Veg",
          roomNumber: "",
          rfidUID: ""
        });
        
        onSuccess?.();
      } else {
        toast({
          title: "Error Creating Student",
          description: data.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error Creating Student",
        description: "Server error while creating student",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deptNo" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Department Number
            </Label>
            <Input
              id="deptNo"
              value={formData.deptNo}
              onChange={(e) => handleInputChange("deptNo", e.target.value)}
              placeholder="e.g., CSE001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select value={formData.year.toString()} onValueChange={(value) => handleInputChange("year", parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="+91 9876543210"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="student@college.edu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="messType" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Mess Type
            </Label>
            <Select value={formData.messType} onValueChange={(value) => handleInputChange("messType", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Veg">Vegetarian</SelectItem>
                <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomNumber" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Room Number
            </Label>
            <Input
              id="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => handleInputChange("roomNumber", e.target.value)}
              placeholder="e.g., A-101"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="rfidUID" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            RFID UID
          </Label>
          <div className="flex gap-2">
            <Input
              id="rfidUID"
              value={formData.rfidUID}
              placeholder="Scan RFID to populate..."
              readOnly
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={scanRFID}
              disabled={scanningRFID}
            >
              {scanningRFID ? "Scanning..." : "Scan RFID"}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Student..." : "Create Student"}
        </Button>
      </form>
    </Card>
  );
};