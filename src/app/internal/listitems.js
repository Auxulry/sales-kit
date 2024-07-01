import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {Domain, People as PeopleIcon, Dashboard as DashboardIcon, AdsClick} from "@mui/icons-material";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton href='/internal'>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton href='/internal/team'>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Team" />
    </ListItemButton>
    <ListItemButton href='/internal/domain'>
      <ListItemIcon>
        <Domain />
      </ListItemIcon>
      <ListItemText primary="Domain" />
    </ListItemButton>
    <ListItemButton href='/internal/domain'>
      <ListItemIcon>
        <AdsClick />
      </ListItemIcon>
      <ListItemText primary="Ads Management" />
    </ListItemButton>
    <ListItemButton href='/internal/customer'>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Contact" />
    </ListItemButton>
  </React.Fragment>
);
