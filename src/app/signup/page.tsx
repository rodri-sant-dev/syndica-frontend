"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	Card,
	CardContent,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
	Snackbar,
	Alert,
	CircularProgress,
} from "@mui/material";
import {
	Visibility as VisibilityIcon,
	VisibilityOff as VisibilityOffIcon,
	CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

import { signUpSchema, SignUpFormData } from "@/types/signup";
import { createUser } from "@/services/signup-service";
import { maskCPF, unmaskCPF } from "@/components/mask-cpf";

export default function SignUp() {
	const [showPassword, setShowPassword] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [snackbar, setSnackbar] = useState<{
		open: boolean;
		message: string;
		type: "success" | "error";
	}>({
		open: false,
		message: "",
		type: "success",
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
		setValue,
		reset,
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		mode: "onSubmit",
	});

	const cpfValue = watch("cpf");

	const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const masked = maskCPF(e.target.value);
		setValue("cpf", masked);
	};

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setValue("perfilPhoto", file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = async (data: SignUpFormData) => {
		try {
			const unmaskedCPF = unmaskCPF(data.cpf);
			const formData = {
				...data,
				cpf: unmaskedCPF,
			};

			await createUser(formData);

			setSnackbar({
				open: true,
				message: "Account created successfully!",
				type: "success",
			});

			reset();
			setPreviewImage(null);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error creating account";

			setSnackbar({
				open: true,
				message: errorMessage,
				type: "error",
			});
		}
	};

	const closeSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

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
					maxWidth: 500,
					borderRadius: 3,
					border: "1px solid",
					borderColor: "divider",
				}}
			>
				<CardContent sx={{ p: 5 }}>
					<Stack spacing={4}>
						<Stack spacing={1.5} sx={{ alignItems: "center" }}>
							<Box sx={{ textAlign: "center" }}>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									Create Account
								</Typography>
								<Typography
									variant="body2"
									color="textSecondary"
									sx={{ mt: 0.5 }}
								>
									Sign up to access Syndica
								</Typography>
							</Box>
						</Stack>

						<Stack
							component="form"
							spacing={2.5}
							onSubmit={handleSubmit(onSubmit)}
						>
							{/* Full Name */}
							<TextField
								label="Full Name"
								type="text"
								fullWidth
								error={!!errors.fullname}
								helperText={errors.fullname?.message}
								disabled={isSubmitting}
								{...register("fullname")}
							/>

							{/* Email */}
							<TextField
								label="Email"
								type="email"
								fullWidth
								error={!!errors.email}
								helperText={errors.email?.message}
								disabled={isSubmitting}
								{...register("email")}
							/>

							{/* CPF with mask */}
							<TextField
								label="CPF"
								type="text"
								fullWidth
								placeholder="000.000.000-00"
								error={!!errors.cpf}
								helperText={errors.cpf?.message}
								disabled={isSubmitting}
								value={cpfValue || ""}
								onChange={handleCPFChange}
							/>

							{/* Password */}
							<TextField
								label="Password"
								type={showPassword ? "text" : "password"}
								fullWidth
								error={!!errors.password}
								helperText={errors.password?.message}
								disabled={isSubmitting}
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label={
														showPassword
															? "Hide password"
															: "Show password"
													}
													onClick={() =>
														setShowPassword((prev) => !prev)
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
								{...register("password")}
							/>

							{/* Profile Photo Upload */}
							<Box>
								<Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
									Profile Photo (Optional)
								</Typography>
								<Box
									sx={{
										display: "flex",
										gap: 2,
										flexDirection: { xs: "column", sm: "row" },
									}}
								>
									<label
										htmlFor="photo-input"
										style={{ flex: 1, cursor: "pointer" }}
									>
										<Box
											component="div"
											sx={{
												border: "2px dashed",
												borderColor: errors.perfilPhoto
													? "error.main"
													: "divider",
												borderRadius: 1,
												p: 2,
												textAlign: "center",
												cursor: "pointer",
												transition:
													"background-color 0.2s, border-color 0.2s",
												"&:hover": {
													backgroundColor: "action.hover",
													borderColor: "primary.main",
												},
											}}
										>
											<CloudUploadIcon
												sx={{
													fontSize: 32,
													color: "primary.main",
													mb: 1,
												}}
											/>
											<Typography variant="body2">
												Click to select
											</Typography>
											<Typography variant="caption" color="textSecondary">
												JPEG or PNG (max 5MB)
											</Typography>
										</Box>
									</label>
									<input
										id="photo-input"
										type="file"
										accept="image/jpeg,image/png"
										style={{ display: "none" }}
										disabled={isSubmitting}
										onChange={handlePhotoChange}
									/>

									{/* Image Preview */}
									{previewImage && (
										<Box
											sx={{
												width: 100,
												height: 100,
												borderRadius: 1,
												overflow: "hidden",
												border: "1px solid",
												borderColor: "divider",
												backgroundColor: "action.hover",
											}}
										>
											<img
												src={previewImage}
												alt="Preview"
												style={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
											/>
										</Box>
									)}
								</Box>
								{errors.perfilPhoto && (
									<Typography variant="body2" color="error" sx={{ mt: 1 }}>
										{errors.perfilPhoto.message}
									</Typography>
								)}
							</Box>

							{/* Submit Button */}
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
									position: "relative",
								}}
							>
								{isSubmitting ? (
									<>
										<CircularProgress
											size={20}
											sx={{
												position: "absolute",
												left: "50%",
												marginLeft: "-10px",
											}}
										/>
										<span style={{ visibility: "hidden" }}>Sign Up</span>
									</>
								) : (
									"Sign Up"
								)}
							</Button>
						</Stack>
					</Stack>
				</CardContent>
			</Card>

			{/* Feedback Snackbar */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={closeSnackbar}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert
					onClose={closeSnackbar}
					severity={snackbar.type}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
}