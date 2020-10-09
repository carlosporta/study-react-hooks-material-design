import React, { useEffect, useCallback, useState, useMemo } from 'react';

import './App.css';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { CssBaseline, Divider, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import {dateAsCustomString, api, SORTS} from "./utils"

const Story = ({ story: { title, url, points, author, created_at, num_comments }, children }) => {
    return <div>
      <Typography color="textSecondary" variant="body1">
        <a href={url}>{title}</a> ({(new URL(url)).hostname})
        </Typography>
      <Typography variant="caption">
        {points} points by {author} {dateAsCustomString(created_at)} | {num_comments} comments
        </Typography>
      {children}
    </div>
  }
  
  const useStyles = makeStyles({
    container: {
      display: "grid",
      gridTemplateColumns: "2fr 0.5fr 0.5fr",
      margin: "5px 0px"
    },
    sortBy: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      margin: "5px 0px"
    }
  });
  
  const MuiApp = () => {
    const classes = useStyles();
  
    const [searchTerm, setSearchTerm] = useState("");
    const [toSearch, setToSearch] = useState(false);
    const [stories, setStories] = useState([]);
    const [sortBy, setSortBy] = useState("NONE");
    const [sortAsc, setSortAsc] = useState(true);
    const [icons, setIcons] = useState(
      { title: <ImportExportIcon />, points: <ImportExportIcon />, num_comments: <ImportExportIcon /> }
    );
    
    const [useDarkTheme, setUseDarkTheme] = useState(false);
  
    const darkTheme = createMuiTheme({
      palette: {
        type: useDarkTheme ? 'dark' : 'light',
      },
    }); 
  
    const handleFetchStories = useCallback(async () => {
      if (toSearch) {
        const response = await api.get(searchTerm);
        const filtered = response.data.hits.filter(s => s.url && s.title)
        setStories(filtered);
        setToSearch(false);
      }
    }, [toSearch, searchTerm]);
  
    const handleOnSubmit = event => {
      setToSearch(true);
      event.preventDefault();
    }
  
    useEffect(() => {
      handleFetchStories();
    }, [handleFetchStories]);
  
    const handleSortBy = (event, buttonName) => {
      if (sortBy === buttonName) {
        if (sortAsc) {
          setSortAsc(false);
          setIcons(old => {
            old.title = <ImportExportIcon />
            old.points = <ImportExportIcon />
            old.num_comments = <ImportExportIcon />
            old[buttonName] = <ArrowDownwardIcon />
            return old;
          });
        }
        else {
          setSortBy("NONE");
          setIcons(old => {
            old.title = <ImportExportIcon />
            old.points = <ImportExportIcon />
            old.num_comments = <ImportExportIcon />
            return old;
          });
        }
      }
      else {
        setSortBy(buttonName);
        setSortAsc(true);
        setIcons(old => {
          old.title = <ImportExportIcon />
          old.points = <ImportExportIcon />
          old.num_comments = <ImportExportIcon />
          old[buttonName] = <ArrowUpwardIcon />
          return old;
        });
      }
    }
  
    const sortedStories = useMemo(() => {
      const sortFunction = SORTS[sortBy.toUpperCase()];
      return sortFunction(stories, sortAsc);
    }, [stories, sortBy, sortAsc]);
  
    return <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <form onSubmit={e => handleOnSubmit(e)}>
        <div className={classes.container}>
          <TextField
          label="Search"
          variant="filled"
          onChange={e => setSearchTerm(e.target.value)} />
        <IconButton type="submit" aria-label="search">
          <SearchIcon />
        </IconButton>
        <IconButton onClick={event => setUseDarkTheme(!useDarkTheme)}>
          {useDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />} 
        </IconButton>
      </div>
      </form>
      <div>
        <ButtonGroup className={classes.sortBy} variant="contained" color="primary" aria-label="contained primary button group">
          <Button variant="contained" startIcon={icons.title} color="primary" name="title" onClick={event => handleSortBy(event, "title")}>Title</Button>
          <Button variant="contained" startIcon={icons.points} color="primary" name="points" onClick={event => handleSortBy(event, "points")}>Points</Button>
          <Button variant="contained" startIcon={icons.num_comments} color="primary" name="num_comments" onClick={event => handleSortBy(event, "num_comments")}>Comments</Button>
        </ButtonGroup>
      </div>
      <div>
        {sortedStories.map((story, index) => <Story key={index} story={story}><Divider /></Story>)}
      </div>
    </ThemeProvider>
  };
  export default MuiApp;
