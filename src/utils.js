import axios from 'axios';
import { sortBy } from 'lodash';

const api = axios.create({
    baseURL: 'https://hn.algolia.com/api/v1/search?query=',
  });
  
  
const SORTS = {
NONE: (list, asc = false) => list,
TITLE: (list, asc = false) => asc ? sortBy(list, 'title') : sortBy(list, 'title').reverse(),
NUM_COMMENTS: (list, asc = false) => asc ? sortBy(list, 'num_comments') : sortBy(list, 'num_comments').reverse(),
POINTS: (list, asc = false) => asc ? sortBy(list, 'points') : sortBy(list, 'points').reverse(),
};
  
  
const dateAsCustomString = dateString => {
const now = new Date();
const storyDate = new Date(dateString);
const diffMs = now - storyDate

const diffDays = Math.floor(diffMs / 86400000);

if (diffDays)
    if (diffDays === 1)
    return `${diffDays} day`
    else
    return `${diffDays} days`


const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
if (diffHrs)
    if (diffHrs === 1)
    return `${diffHrs} hour`
    else
    return `${diffHrs} hours`

const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
if (diffMins)
    if (diffMins === 1)
    return `${diffMins} min`
    else
    return `${diffMins} mins`

return "0 min"
}


export { api, dateAsCustomString, SORTS }