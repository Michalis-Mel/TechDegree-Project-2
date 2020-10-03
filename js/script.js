/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/

//Insert a search box at the top right of the page
const header = document.querySelector(".header");
const search = `
   <label for="search" class="student-search">
      <input id="search" placeholder="Search by name...">
      <button type="button class="searchBtn" "><img src="img/icn-search.svg" alt="Search icon"></button>
   </label>`;
header.insertAdjacentHTML("beforeend", search);

//Variables i will need for search input
const searchParent = header.lastElementChild;
const clickSearch = searchParent.querySelector("button");
const searchInput = searchParent.firstElementChild;

// select the element with a class of `student-list` and assign it to a variable
const studentList = document.querySelector(".student-list");
// select the element with a class of `link-list` and assign it to a variable
const linkList = document.querySelector(".link-list");

//clearing an html element function
function clear(element) {
  return (element.innerHTML = "");
}
/*
Create the `showPage` function
This function will create and insert/append the elements needed to display a "page" of nine students
*/
function showPage(list, page) {
  // create two variables which will represent the index for the first and last student on the page
  const startIndex = page * 9 - 9;
  const endIndex = page * 9 - 1;

  // set the innerHTML property of the variable you just created to an empty string
  clear(studentList);
  // loop over the length of the `list` parameter
  if (list.length === 0) {
    studentList.innerHTML = ` <div class='empty'>No Results</div>`;
  } else {
    for (let i = 0; i < list.length; i++) {
      // inside the loop create a conditional to display the proper students
      if (i >= startIndex && i <= endIndex) {
        // create the elements needed to display the student information
        let studentItem = `
         <li class="student-item cf">
            <div class="student-details">
               <img class="avatar" src=${list[i].picture.medium} alt="Profile Picture">
               <h3>${list[i].name.first} ${list[i].name.last}</h3>
            <span class="email">${list[i].email}</span>
            </div>
            <div class="joined-details">
               <span class="date">${list[i].registered.date}</span>
            </div>
         </li>
        `;
        // insert the above elements to the page
        studentList.insertAdjacentHTML("beforeend", studentItem);
      }
    }
  }
}

/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/
function addPagination(list) {
  // create a variable to calculate the number of pages needed
  const numOfPages = Math.ceil(list.length / 9);
  // set the innerHTML property of the variable you just created to an empty string
  clear(linkList);
  // loop over the number of pages needed
  for (i = 1; i <= numOfPages; i++) {
    // create the elements needed to display the pagination button
    let button = `
      <li>
         <button type="button">${i}</button>
      </li>`;
    // insert the button element to the linkList
    linkList.insertAdjacentHTML("beforeend", button);
    // give the first pagination button a class of "active"
    const firstBtn = document.querySelector(".link-list button");
    firstBtn.className = "active";
  }

  // create an event listener on the `link-list` element
  linkList.addEventListener("click", (e) => {
    let event = e.target;
    // if the click target is a button:
    if (event.type === "button") {
      // remove the "active" class from the previous button
      let active = document.querySelector(".active");
      active.classList.remove("active");
      // add the active class to the clicked button
      event.className = "active";
      // call the showPage function passing the `list` parameter and page to display as arguments
      showPage(list, event.textContent);
    }
  });
}

//Takes the array of students and filters those who matched the search argument,then returns them.
function searchFn(search, data) {
  const newData = [];

  for (let student of data) {
    let studentName =
      student.name.first.toLowerCase() + " " + student.name.last.toLowerCase();

    if (
      search.length > 0 &&
      studentName.includes(search.toLowerCase().trim(""))
    ) {
      newData.push(student);
    }
  }

  return newData;
}

//Controls the search's bar behaviour query(String) students(Filtered Array of students).
function searchControl(query, students) {
  //if no input provided to search for students return the main page.
  if (query.length == 0) {
    showPage(data, 1);
    addPagination(data);
    return;
  }

  //if the input provided did not match any filtered students.
  else if (students.length == 0) {
    //clean the current list of students and paginationButtons to insert a NOT FOUND message.
    clear(linkList);
    clear(studentList);
    studentList.innerHTML = ` <div class='nomatch'>No Matches were found</div>`;

    return;
  }

  //Defining the number of student tha will be displayed per page.
  let totalPages = Math.ceil(students.length / 9);

  //passing them as arguments to the showPage and addPagination functions.
  showPage(students, 1);
  addPagination(students);

  return;
}

//Event Handlers
clickSearch.addEventListener("click", () => {
  const filteredStudents = searchFn(searchInput.value, data);
  searchControl(searchInput.value, filteredStudents);
});

//event listener for every time the user press a key in the search input area
searchInput.addEventListener("keyup", () => {
  const filteredStudents = searchFn(searchInput.value, data);
  searchControl(searchInput.value, filteredStudents);
});

// Call functions
showPage(data, 1);
addPagination(data);
