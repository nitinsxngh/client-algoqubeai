import React from "react";
import Menuitems from "./MenuItems";
import { Box, Typography, Avatar, Chip, Divider } from "@mui/material";
import {
  Logo,
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint, IconBrain, IconSparkles } from '@tabler/icons-react';
import Link from "next/link";
import { usePathname } from "next/navigation";



const renderMenuItems = (items: any, pathDirect: any) => {

  return items.map((item: any) => {

    const Icon = item.icon ? item.icon : IconPoint;

    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    if (item.subheader) {
      // Display Subheader
      return (
        <Menu
          subHeading={item.subheader}
          key={item.subheader}
        />
      );
    }

    //If the item has children (submenu)
    if (item.children) {
      return (
        <Submenu
          key={item.id}
          title={item.title}
          icon={itemIcon}
          borderRadius='7px'
        >
          {renderMenuItems(item.children, pathDirect)}
        </Submenu>
      );
    }

    // If the item has no children, render a MenuItem

    return (
      <Box px={3} key={item.id}>
        <MenuItem
          key={item.id}
          isSelected={pathDirect === item?.href}
          borderRadius='8px'
          icon={itemIcon}
          link={item.href}
          component={Link}
        >
          {item.title}
        </MenuItem >
      </Box>

    );
  });
};


const SidebarItems = () => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <>
      <MUI_Sidebar
        width={"100%"}
        showProfile={false}
        themeColor={"#6366f1"}
        themeSecondaryColor={"#8b5cf6"}
      >
        {/* Enhanced Logo Section */}
        <Box 
          sx={{ 
            p: 3, 
            pb: 2,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
              }}
            >
              <IconBrain size={18} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }}>
            AlgoqubeAI
          </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                AI Chatbot Platform
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Menu Items with better spacing */}
        <Box sx={{ flex: 1, py: 1 }}>
        {renderMenuItems(Menuitems, pathDirect)}
        </Box>

        {/* Professional Bottom Section */}
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Divider sx={{ mb: 2, opacity: 0.1 }} />
          
          {/* AI Status Indicator */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            mb: 2
          }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
              }}
            >
              <IconBrain size={16} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                AI Assistant
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Powered by GPT-4
              </Typography>
            </Box>
            <Chip
              label="Online"
              size="small"
              sx={{
                bgcolor: 'success.light',
                color: 'success.contrastText',
                fontSize: '0.625rem',
                height: 20,
                '& .MuiChip-label': { px: 1 }
              }}
            />
          </Box>

          {/* Version Info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 1.5,
            borderRadius: 1.5,
            background: 'rgba(0, 0, 0, 0.02)',
            border: '1px solid rgba(0, 0, 0, 0.04)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconSparkles size={14} color="#6366f1" />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                v2.1.0
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Beta
            </Typography>
          </Box>
        </Box>
      </MUI_Sidebar>
    </>
  );
};

export default SidebarItems;
