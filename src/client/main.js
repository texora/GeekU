'use strict';

import '../shared/util/polyfill';
import subject from '../shared/model/subject';
import axios  from 'axios';

console.log(`??? here we are in src/client/main.js: academicGroupExists("Graduate Management"): '${subject.academicGroupExists("Graduate Management")}' !!!`);

// axios.get('http://localhost:8080/api/courses')
// axios.get('/api/courses?fields=courseNum,ouch,courseDesc') ??? hmmm it appears that axios is putting all errors with it's data ... need to research this further
axios.get('/api/courses/?fields=courseNum,courseTitle&filter={"_id":{"$in":["CS-1110","CS-1112"]}}')
.then(resp => {
  const courses = resp.data;
  console.log('??? received courses: ', courses);
})
.catch(err => { // ??? per axios err is really a resp
  console.log("??? err: ", err);
  console.log("??? err.data: ", err.data);
});
       
