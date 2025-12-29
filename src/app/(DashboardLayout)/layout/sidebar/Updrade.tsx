import { Box, Typography } from '@mui/material';
import Image from 'next/image';

export const Upgrade = () => {
    return (
        <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ mt: 3, p: 3, bgcolor: 'primary.light', borderRadius: '8px' }}
        >
            <Box>
                <Typography variant="h6" fontSize="16px" mb={1}>
                    Want to explore more features?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Reach out to us to get started with advanced tools.
                </Typography>
            </Box>
            <Box mt="-35px">
                <Image
                    alt="Rocket illustration"
                    src="/images/backgrounds/rocket.png"
                    width={100}
                    height={100}
                />
            </Box>
        </Box>
    );
};
