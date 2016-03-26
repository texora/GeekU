'use strict';

import '../shared/util/polyfill';
import subject from '../shared/model/subject';
import axios  from 'axios';

console.log(`??? here we are in src/client/main.js: academicGroupExists("Graduate Management"): '${subject.academicGroupExists("Graduate Management")}' !!!`);

axios.get('/api/courses/?fields=courseNum,courseTitle&filter={"_id":{"$in":["CS-1110","CS-1112"]}}')
// axios.get('http://localhost:8080/api/courses')
     .then(resp => {
       const courses = resp.data;
       console.log('??? received courses: ', courses);
     })
     .catch(err => { // ??? is ALSO RESP
       console.log("??? err: ", err);
       console.log("??? err.data: ", err.data);
     });
       
