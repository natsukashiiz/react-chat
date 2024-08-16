import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sigup } from "@/api/auth";
import { AxiosError } from "axios";
import useAuthStore from "@/stores/auth";
import { useNavigate } from "react-router-dom";

const formSchema = z
  .object({
    username: z
      .string()
      .regex(
        new RegExp("([a-zA-Z0-9_]{4,16})"),
        "Username must be 4-16 characters long and can only include letters (a-z, A-Z), numbers (0-9), and underscores (_)."
      ),
    mobile: z
      .string()
      .regex(
        new RegExp("^(0[689])\\d{8}$"),
        "Please enter a valid mobile number starting with 06, 08, or 09, followed by 8 digits."
      ),
    password: z.string().min(4, "Password is too short"),
    confirmPassword: z.string().min(4, "Password is too short"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Password didn't match.",
  });

const Login = () => {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      const res = await sigup(values);
      if (res.status === 200 && res.data) {
        setToken(res.data.data);
        navigate("/chat");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 417) {
          if (error.response.data.error === "signup.username.exists") {
            form.setError("username", {
              type: "manual",
              message: "Username already exists",
            });
          } else if (error.response.data.error === "signup.mobile.exists") {
            form.setError("mobile", {
              type: "manual",
              message: "Mobile number already exists",
            });
          }
        }
      }
    }
  };

  return (
    <Card className="mx-auto max-w-sm mt-36">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Create a new account to access all features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={16} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to={"/login"} className="underline">
                Login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Login;
