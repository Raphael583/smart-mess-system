import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { useToast } from "../hooks/use-toast";
import cosmicBackground from "../assets/cosmic-background.jpg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
    const navigate=useNavigate();
  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    


    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      
      toast({
        title: "Success!",
        description: data.message || "Login successful",
      });

      // Redirect after login
      setTimeout(() => {
        navigate("/dashboard");
        window.location.href = "/dashboard";
      }, 500);
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cosmicBackground})` }}
      />
      
      {/* Additional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-primary/30 via-cosmic-secondary/20 to-cosmic-accent/30" />
      
      {/* Floating stars animation */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-glass-bg backdrop-blur-xl border border-glass-border shadow-glass-shadow rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
              Login
            </h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-cosmic-cyan to-cosmic-orange mx-auto rounded-full" />
          </div>

          <div className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-lg backdrop-blur-sm focus:border-cosmic-cyan focus:ring-cosmic-cyan/20 transition-all duration-300"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-lg backdrop-blur-sm focus:border-cosmic-cyan focus:ring-cosmic-cyan/20 transition-all duration-300"
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-cosmic-cyan to-cosmic-cyan/80 hover:from-cosmic-cyan/90 hover:to-cosmic-cyan/70 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-cosmic-cyan/25"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center">
              <p className="text-white/80 text-sm">
                Don't have an account?{" "}
                <a 
                  href="/register" 
                  className="text-cosmic-cyan hover:text-cosmic-orange transition-colors duration-300 font-medium underline underline-offset-2"
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;