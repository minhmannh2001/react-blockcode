import React, { useState } from 'react';
import { Paper, Typography, Box, Button, ButtonGroup, alpha, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Clear, Save, Upload } from '@mui/icons-material';
import Block from './Block';
import { scriptToJson, jsonToScript } from '../utils/file';

const ScriptContainer = styled(Paper)(({ theme, isDragOver }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: isDragOver ? alpha(theme.palette.primary.main, 0.1) : '#f8f9fa',
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.2s ease',
}));

const ScriptHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: '64px',
  gap: theme.spacing(3),
}));

const ScriptContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(1),
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
  },
}));

const EmptyScriptMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const Script = ({ blocks, setBlocks, onDragStart, onDragEnter, onDragLeave, onDragOver, onDrop, onClear, onUpdateBlockValue }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('blockcode.json');

  const handleDragEnter = (e) => {
    setIsDragOver(true);
    onDragEnter(e);
  };

  const handleDragLeave = (e) => {
    setIsDragOver(false);
    onDragLeave(e);
  };

  const handleDrop = (e) => {
    setIsDragOver(false);
    onDrop(e, 'script', null);
  };

  const handleSave = () => {
    try {
      const json = scriptToJson(blocks);
      if (json) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSaveDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save file.");
    }
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            jsonToScript(e.target.result, setBlocks);
          } catch (error) {
            console.error("Error loading file:", error);
            alert(`Failed to load file: ${error.message}`);
          }
        };
        reader.readAsText(file);
      }
      document.body.removeChild(input);
    };
    document.body.appendChild(input);
    input.click();

    input.addEventListener('cancel', () => {
      document.body.removeChild(input);
    });
  };

  return (
    <>
      <ScriptContainer
        elevation={3}
        isDragOver={isDragOver}
        onDragOver={onDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ScriptHeader>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              fontWeight: 600,
              color: 'secondary.main'
            }}
          >
            Script
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            <Button 
              onClick={onClear}
              disabled={!blocks || blocks.length === 0}
              startIcon={<Clear />}
              color="error"
            >
              Clear
            </Button>
            <Button 
              onClick={() => setSaveDialogOpen(true)}
              disabled={!blocks || blocks.length === 0}
              startIcon={<Save />}
              color="primary"
            >
              Save
            </Button>
            <Button 
              onClick={handleLoad}
              startIcon={<Upload />}
              color="primary"
            >
              Load
            </Button>
          </ButtonGroup>
        </ScriptHeader>
        <ScriptContent>
          {blocks && blocks.length > 0 ? (
            blocks.map((block) => (
              <Block
                key={block.id}
                block={block}
                onDragStart={(e, dragTarget) => onDragStart(e, dragTarget ? dragTarget : block, 'script')}
                onDragEnter={onDragEnter}
                onDragOver={onDragOver}
                onDrop={onDrop}
                variant="script"
                onUpdateBlockValue={onUpdateBlockValue}
              />
            ))
          ) : (
            <EmptyScriptMessage>
              <Typography variant="body2">
                Drag blocks here to build your script
              </Typography>
            </EmptyScriptMessage>
          )}
        </ScriptContent>
      </ScriptContainer>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Script</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="File Name"
            fullWidth
            variant="outlined"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Script;
