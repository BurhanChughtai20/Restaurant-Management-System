"use client";

import * as React from 'react';
import clsx from 'clsx';
import { animated, useSpring } from '@react-spring/web';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemContent,
  TreeItemIconContainer,
  TreeItemLabel,
  TreeItemRoot,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import type { TreeViewConfig } from './types';
import type { TransitionProps } from '@mui/material/transitions';

const TREE_VIEW_GAP = '8px';
const TREE_VIEW_MARGIN = '0 -8px';
const TREE_VIEW_PADDING_BOTTOM = '8px';

const AnimatedCollapse = animated(Collapse);

// ---------------- Transition Component ----------------
// Using proper TransitionProps type instead of 'any'
const TransitionComponent: React.FC<TransitionProps> = ({ in: open, children, ...props }) => {
  const style = useSpring({
    to: { opacity: open ? 1 : 0, transform: `translate3d(0,${open ? 0 : 20}px,0)` },
  });
  return (
    <AnimatedCollapse style={style} in={open} {...props}>
      {children}
    </AnimatedCollapse>
  );
};
TransitionComponent.displayName = 'TransitionComponent';

// ---------------- Dot Icon ----------------
const DotIcon: React.FC<{ color: string }> = React.memo(({ color }) => (
  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />
  </Box>
));
DotIcon.displayName = 'DotIcon';

// ---------------- Custom Label ----------------
interface CustomLabelProps {
  children: React.ReactNode;
  color?: string;
}

const CustomLabel: React.FC<CustomLabelProps> = React.memo(({ color, children }) => (
  <TreeItemLabel sx={{ display: 'flex', alignItems: 'center' }}>
    {color && <DotIcon color={color} />}
    <Typography variant="body2" sx={{ color: '#000' }}>{children}</Typography>
  </TreeItemLabel>
));
CustomLabel.displayName = 'CustomLabel';

// ---------------- Custom Tree Item ----------------
interface CustomTreeItemProps
  extends Omit<UseTreeItemParameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

const CustomTreeItem = React.forwardRef<HTMLLIElement, CustomTreeItemProps>((props, ref) => {
  const { id, itemId, label, disabled, children, ...other } = props;

  const { getRootProps, getContentProps, getIconContainerProps, getLabelProps, getGroupTransitionProps, status, publicAPI } =
    useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const color = item?.color || '#000';

  return (
    <TreeItemProvider id={id} itemId={itemId}>
      <TreeItemRoot {...getRootProps(other)}>
        <TreeItemContent
          {...getContentProps({
            className: clsx('content', {
              expanded: status.expanded,
              selected: status.selected,
              focused: status.focused,
              disabled: status.disabled,
            }),
          })}
        >
          {status.expandable && (
            <TreeItemIconContainer {...getIconContainerProps()}>
              <TreeItemIcon status={status} />
            </TreeItemIconContainer>
          )}
          <CustomLabel {...getLabelProps({ color })}>{label}</CustomLabel>
        </TreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});
CustomTreeItem.displayName = 'CustomTreeItem';

// ---------------- Main Component ----------------
const CustomizedTreeView: React.FC<TreeViewConfig> = ({
  title,
  items,
  defaultExpanded = [],
  defaultSelected = [],
  multiSelect = true,
}) => {
  const cardStyles = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: TREE_VIEW_GAP,
    flexGrow: 1,
    backgroundColor: '#fff',
  }), []);

  const treeViewStyles = React.useMemo(() => ({
    margin: TREE_VIEW_MARGIN,
    paddingBottom: TREE_VIEW_PADDING_BOTTOM,
    height: 'fit-content',
    flexGrow: 1,
    overflowY: 'auto',
  }), []);

  return (
    <Card variant="outlined" sx={cardStyles}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" mb={1}>
          {title}
        </Typography>
        <RichTreeView
          items={items}
          aria-label={title}
          multiSelect={multiSelect}
          defaultExpandedItems={defaultExpanded}
          defaultSelectedItems={defaultSelected}
          sx={treeViewStyles}
          slots={{ item: CustomTreeItem }}
        />
      </CardContent>
    </Card>
  );
};

CustomizedTreeView.displayName = 'CustomizedTreeView';

export default React.memo(CustomizedTreeView);
