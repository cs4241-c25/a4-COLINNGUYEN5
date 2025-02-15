import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

function TrackingSheet() {

    const [user, setUser] = useState({
        name: "",
        major: "Computer Science",
    })
    const [title, setTitle] = useState("");
    const [sheet, setSheet] = useState(false);
    const [addData, setAddData] = useState({
        component: "computerScience",
        courseInput: "",
        creditInput: ""
    })
    const [editData, setEditData] = useState({
        component: "computerScience",
        picked: "",
        course: "",
        credit: ""
    })
    const [courses, setCourses] = useState([])
    const [removeData, setRemoveData] = useState({
        component: "computerScience",
        course: "",
    })
    const [totalCredits, setTotalCredits] = useState(0);

    const navigate = useNavigate(); // Hook to navigate programmatically
    const API_BASE_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:3001"
            : "https://a4-colinnguyen5.glitch.me";

    useEffect(() => {
        console.log("Courses were Changed")
        const totalCredits = courses.reduce((total, course) => total + parseFloat(course.creditInput || 0), 0);
        setTotalCredits(totalCredits);
    }, [courses]);


    const handleLogout = async function(event) {
        event.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/logout`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            navigate("/");
        } catch (error) {
            alert("Logout failed. Please try again.");
        }
    };

    const handleCreate = async function( event ) {
        event.preventDefault()
        setTitle(user.name + "'s " + user.major + " Tracking Sheet");
        setSheet(true);
        const response = await fetch( "/api/submit", {
            method:'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
            credentials: "include",
        })
        const data = await response.json()
        setCourses(data);
        const resetUser = () => {
            setUser({
                name: "",
                major: "Computer Science"
            });
        }
        resetUser();
    }

    const handleAdd = async function ( event ){
        event.preventDefault();
        const response = await fetch( "/api/add", {
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addData)
        })
        const data = await response.json()
        setCourses(data);
        const resetAdd = () => {
            setAddData({
                component: "computerScience",
                courseInput: "",
                creditInput: "",
            });
        }
        resetAdd();
    }

    const handleEdit = async function( event ) {
        event.preventDefault()
        const response = await fetch( "/api/edit", {
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editData)
        })
        const data = await response.json();
        setCourses(data);
        const resetEdit = () => {
            setEditData({
                component: "computerScience",
                picked: "",
                course: "",
                credit: ""
            });
        }
        resetEdit();
    }

    const handleRemove = async function( event ) {
        event.preventDefault()
        const response = await fetch( "/api/remove", {
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(removeData)
        })
        const data = await response.json();
        setCourses(data);
        setRemoveData({
            component: "computerScience",
            course: "",
        });
    }

    const generateCourse = () => {
        if (courses.length === 0) {
            return <option disabled>No courses available</option>;
        }
        return courses.map((course, index) => (
            <option key={index} value={course.courseInput}>
                {course.courseInput}
            </option>
        ));
    };

    return (
<div id="index-page" className="ml-2">
    <section className="mt-8 flex-col space-y-5" >
        <h2 className="m-0 font-extrabold text-xl">Create your Sheet!</h2>
        <form id="tracking-sheet" className="pl shadow-xl" onSubmit={handleCreate}>
            <section>
                <label htmlFor="yourname">Your Name: </label>
                <input type="text" id="yourname" name="yourname" className="bg-gray-200" value={user.name} onChange={(e) => {setUser({...user, name: e.target.value})}} />
            </section>
            <section>
                <label htmlFor="major">What's your major?</label>
                <select name="major" id="major" className="bg-gray-200" value={user.major} onChange={(e) => {setUser({...user, major: e.target.value})}}>
                    <option value="computerScience">Computer Science</option>
                </select>
            </section>
            <button type="submit" id="submit" className="bg-gray-200 hover:bg-sky-300">Create Tracking Sheet</button>
        </form>

        {sheet && (
            <>

                <h2 id="add-heading" className="m-0 font-extrabold text-xl">Add a Course</h2>
                <form id="add-course" className="shadow-xl hidden" onSubmit={handleAdd}>
            <section>
                <label htmlFor="component">Pick your Component</label>
                <select name="component" id="component" className="bg-gray-200" value={addData.component} onChange={(e) => setAddData({...addData, component: e.target.value})}>
                    <option value="computerScience">Computer Science</option>
                </select>
            </section>
            <section>
                <label htmlFor="courseInput">Course Name: </label>
                <input type="text" id="courseInput" name="courseInput" className="bg-gray-200" value={addData.courseInput} onChange={(e) => setAddData({...addData, courseInput: e.target.value})}/>
            </section>
            <section>
                <label htmlFor="creditInput">Credits: </label>
                <input type="text" id="creditInput" name="creditInput" className="bg-gray-200" value={addData.creditInput} onChange={(e) => setAddData({...addData, creditInput: e.target.value})}/> / 3
            </section>
            <button type="submit" id="add" className="bg-gray-200 hover:bg-sky-300">Add Course</button>
        </form>

        <h2 id="edit-heading" className="m-0 font-extrabold text-xl">Edit a Course</h2>
        <form id="edit-course" className="shadow-xl hidden" onSubmit={handleEdit}>
            <section>
                <label htmlFor="component-edit">Pick your Component</label>
                <select name="component-edit" id="component-edit" className="bg-gray-200" value={editData.component} onChange={(e) => setEditData({...editData, component: e.target.value})}>
                    <option value="computerScience">Computer Science</option>
                </select>
            </section>
            <section>
                <label htmlFor="index-edit">Pick Course: </label>
                <select name="index-edit" id="index-edit" className="bg-gray-200" value={editData.picked} onChange={(e) => setEditData({...editData, picked: e.target.value})}>
                    <option value="" disabled>Select a Course</option>
                    {generateCourse()}
                </select>
            </section>
            <section>
                <label htmlFor="course-name-edit">Change Course Name: </label>
                <input type="text" id="course-name-edit" name="course-name-edit" className="bg-gray-200" value={editData.course} onChange={(e) => setEditData({...editData, course: e.target.value})}/>
            </section>
            <section>
                <label htmlFor="credits-edit">Change Credits: </label>
                <input type="text" id="credits-edit" name="credits-edit" className="bg-gray-200" value={editData.credit} onChange={(e) => setEditData({...editData, credit: e.target.value})}/> / 3
            </section>
            <button type="submit" id="edit" className="bg-gray-200 hover:bg-sky-300">Edit Course</button>
        </form>
        <h2 id="remove-heading" className="m-0 font-extrabold text-xl">Remove a Course</h2>
        <form id="remove-course" className="shadow-xl hidden" onSubmit={handleRemove}>
            <section>
                <label htmlFor="major">Pick your Component</label>
                <select name="major" id="component-remove" className="bg-gray-200" value={removeData.component} onChange={(e) => setRemoveData({...removeData, component: e.target.value})}>
                    <option value="computerScience">Computer Science</option>
                </select>
            </section>
            <section>
                <label htmlFor="index-remove">Pick Course: </label>
                <select name="index-remove" id="index-remove" className="bg-gray-200" value={removeData.course} onChange={(e) => setRemoveData({...removeData, course: e.target.value})}>
                    <option value="" disabled>Select a Course</option>
                    {generateCourse()}
                </select>
            </section>
            <button type="submit" id="remove" className="bg-gray-200 hover:bg-sky-300">Remove</button>
        </form>
            </>
    )}
</section>

{
    sheet && (<section className="right-container hidden" id="cs-sheet">
            <section id="name" className="m-0 font-extrabold text-xl">
                {title}
            </section>
            <button type="submit" id="logout" className="mt-2 bg-gray-100 border-2 p-1 rounded-xl hover:bg-sky-300"
                    onClick={handleLogout}>Logout
            </button>
            <section className="major-components">
                <section className="article1">
                    <article>
                        <header>Humanities (6/3 Credits) <p className="text-red-600">*6 CREDITS REQUIRED*</p></header>
                        <table>
                            <thead>
                            <tr>
                                <th className="bg-gray-100"></th>
                                <th>Course</th>
                                <th className="bg-gray-100">Credit</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="text-center">
                                <th className="bg-gray-100">1</th>
                                <td>CH1</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">3</th>
                                <td>CH3</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">4</th>
                                <td>CH4</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">5</th>
                                <td>CH5</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">6</th>
                                <td>CH6</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            </tbody>
                        </table>
                    </article>

                    <article>
                        <header>Physical Education (5/12 Credits)<p className="text-red-600">*5 CREDITS REQUIRED*</p>
                        </header>
                        <table>
                            <thead>
                            <tr>
                                <th className="bg-gray-100"></th>
                                <th>Course</th>
                                <th className="bg-gray-100">Credit</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="text-center">
                                <th className="bg-gray-100">1</th>
                                <td>Volleyball</td>
                                <td className="bg-gray-100">1/12</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">2</th>
                                <td>Basketball</td>
                                <td className="bg-gray-100">1/12</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">3</th>
                                <td>Insight Education</td>
                                <td className="bg-gray-100">1/12</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">4</th>
                                <td>Walking for Fitness</td>
                                <td className="bg-gray-100">1/12</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">5</th>
                                <td>Plyometrics</td>
                                <td className="bg-gray-100">1/12</td>
                            </tr>
                            </tbody>
                        </table>
                    </article>

                    <article>
                        <header>Social Science (2/3 Credits)<p className="text-red-600">*2 CREDITS REQUIRED*</p>
                        </header>
                        <table>
                            <thead>
                            <tr>
                                <th className="bg-gray-100"></th>
                                <th>Course</th>
                                <th className="bg-gray-100">Credit</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="text-center">
                                <th className="bg-gray-100">1</th>
                                <td>Psychology</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">2</th>
                                <td>ID2050</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            </tbody>
                        </table>
                    </article>

                    <article>
                        <header>Interactive Qualifying Center (3/3 Credits)<p
                            className="text-red-600">*3 CREDITS REQUIRED*</p></header>
                        <table>
                            <thead>
                            <tr>
                                <th className="bg-gray-100"></th>
                                <th>Course</th>
                                <th className="bg-gray-100">Credit</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="text-center">
                                <th className="bg-gray-100">1</th>
                                <td>Taiwan</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">2</th>
                                <td>Taiwan</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">3</th>
                                <td>Taiwan</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            </tbody>
                        </table>
                    </article>

                </section>

                <section>

                    <article>
                        <header>Mathematics (7/3 Credits)<p className="text-red-600">*7 CREDITS REQUIRED*</p></header>
                        <table>
                            <thead>
                            <tr>
                                <th className="bg-gray-100"></th>
                                <th>Course</th>
                                <th className="bg-gray-100">Credit</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="text-center">
                                <th className="bg-gray-100">1</th>
                                <td>Calc 1</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">2</th>
                                <td>Calc 2</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">3</th>
                                <td>Calc 3</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">4</th>
                                <td>Calc 4</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">5</th>
                                <td>Linear Algebra</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">6</th>
                                <td>Stats 1</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">7</th>
                                <td>Probability</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            </tbody>
                        </table>
                    </article>

                    <article>
                        <header>Basic Science (5/3 Credits)<p className="text-red-600">*5 CREDITS REQUIRED*</p></header>
                        <table>
                            <thead>
                            <tr>
                                <th className="bg-gray-100 px-1"></th>
                                <th>Course</th>
                                <th className="bg-gray-100">Credit</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="text-center">
                                <th className="bg-gray-100">1</th>
                                <td>Human Bio</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">2</th>
                                <td>Environmental Bio</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">3</th>
                                <td>General Physics</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">4</th>
                                <td>Electric Physics</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">5</th>
                                <td>Geology</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            </tbody>
                        </table>
                    </article>

                    <article>
                        <header>Free Electives (3/3 Credits)<p className="text-red-600">*3 CREDITS REQUIRED*</p>
                        </header>
                        <table>
                            <thead>
                            <tr>
                                <th className="bg-gray-100 px-2"></th>
                                <th>Course</th>
                                <th className="bg-gray-100">Credit</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="text-center">
                                <th className="bg-gray-100">1</th>
                                <td>Elements of Writing</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">2</th>
                                <td>Introduction to Literature</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            <tr className="text-center">
                                <th className="bg-gray-100">3</th>
                                <td>Introduction to Program</td>
                                <td className="bg-gray-100">1/3</td>
                            </tr>
                            </tbody>
                        </table>
                    </article>

                </section>

                <section>

                    <article>
                        <header>
                            Computer Science ({totalCredits}/3 Credits)
                            <p className="text-red-600">*18 CREDITS REQUIRED*</p>
                        </header>
                        <table>
                            <thead>
                            <tr>
                                <th className="bg-gray-100"></th>
                                <th>Course</th>
                                <th className="bg-gray-100">Credit</th>
                            </tr>
                            </thead>
                            <tbody id="csTable"></tbody>
                            {courses.map((course, index) => (
                                <tr key={index} className="text-center">
                                    <th className="bg-gray-100">{index + 1}</th>
                                    <td>{course.courseInput}</td>
                                    <td className="bg-gray-100">{course.creditInput}/3</td>
                                </tr>
                            ))}
                        </table>
                    </article>
                </section>
            </section>
        </section>
    )}
</div>
    )
}

export default TrackingSheet;