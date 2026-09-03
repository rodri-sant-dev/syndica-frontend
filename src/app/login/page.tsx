"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { LoginInterface } from "@/types/login";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/home";
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInterface>();

    const [showPassword, setShowPassword] = useState(false);

    async function onSubmit(data: LoginInterface) {
        const result = await signIn("credentials", {
            ...data,
            redirect: false,
        });

        if (result?.error) {
            setError("root", { message: "E-mail ou senha inválidos" });
            return;
        }

        router.push(callbackUrl);
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                px: 2,
            }}
        >
            <Card
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 380,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <CardContent sx={{ p: 5 }}>
                    <Stack spacing={4}>
                        <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Wellcome to Syndica
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack
                            component="form"
                            spacing={2.5}
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <TextField
                                label="E-mail"
                                type="email"
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                {...register("email", {
                                    required: "Email is requerid",
                                })}
                            />
                            <TextField
                                label="Senha"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword
                                                            ? "Ocultar senha"
                                                            : "Mostrar senha"
                                                    }
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (prev) => !prev,
                                                        )
                                                    }
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOffIcon />
                                                    ) : (
                                                        <VisibilityIcon />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                {...register("password", {
                                    required: "Password is required",
                                })}
                            />
                            <Stack
                                direction="row"
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked={false}
                                            {...register("remember")}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            remember login
                                        </Typography>
                                    }
                                />
                            </Stack>

                            {errors.root && (
                                <Typography variant="body2" color="error">
                                    {errors.root.message}
                                </Typography>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={isSubmitting}
                                sx={{
                                    py: 1.2,
                                    textTransform: "none",
                                    fontWeight: 600,
                                }}
                            >
                                Entrar
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
