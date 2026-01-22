import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const LoginModal = ({ children }) => {
  const { login } = useAuth();
  const { register, handleSubmit } = useForm();
  const [open, setOpen] = React.useState(false);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      setOpen(false);
    } catch (e) {
      alert("Login failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Login to Order.uk</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("email")}
              placeholder="john@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
          </div>
          <Button type="submit" className="bg-[#FC8A06] hover:bg-[#e67d05]">
            Sign in
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
