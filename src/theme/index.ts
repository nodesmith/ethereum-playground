import { createMuiTheme, Theme } from '@material-ui/core';

// This is a collection of custom theme objects that we can use globally in our application
export interface NodesmithTheme extends Theme {
  border?: string;
  boxShadow?: string;
  headerHeight?: number;
}

const customNodesmithThemes = {
  border: '1px solid rgba(0,0,0,.08)',
  boxShadow: '0 2px 4px rgba(0,0,0,.08), 0 2px 12px rgba(0,0,0,.06)',
  headerHeight: 48,
};

export const NODESMITH_GREEN = '#00ae6d';

export const theme = Object.assign(
  createMuiTheme({
    palette: {
      secondary: {
        main: '#ffffff',
        contrastText: '#000000',
      },
      primary: {
        main: NODESMITH_GREEN,
        contrastText: '#ffffff',
      },
    },
    typography: {
      caption: {
        fontSize: '0.85rem' // default is 0.75rem
      },
      useNextVariants: true,
    },
    overrides: {
      MuiMenu: {
        paper: {
          boxShadow: customNodesmithThemes.boxShadow,
          border: customNodesmithThemes.border
        }
      },
      MuiDrawer: {
        docked: {
          height: '100%'
        }
      },
      MuiIconButton: {
        root: {
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }
      },
      MuiBackdrop: {
        root: {
          backgroundColor: '#9da9bf8c'
        }
      }
    }
  }),
  customNodesmithThemes
);
