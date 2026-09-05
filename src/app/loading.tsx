import { CircularProgress, Stack, Typography } from "@mui/material";

export default function LoadingView(){
    return(
        <Stack 
        sx={{
            width:"100vw",
            height:"100vh",
            justifyContent:"center",
            alignItems:"center"
        }}>
            <CircularProgress size={40}/>
            <Typography 
                variant="h3"
                sx={{
                    fontSize:"bold",
                    fontFamily:"bold"
                }}
             >
                Estamos preparando tudo para voce...
            </Typography>
        </Stack>
    )
}