import { useState, useEffect } from 'react';
import './App.css';
import { Toaster, toast } from 'react-hot-toast';


type Job = {
  id: number;
  role: string;
  company: string;
  platform: string;
  status: string;
  applied_date: string;
}

const API_URL = "http://localhost:3001/api/jobs"

function App() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Select Status");
  const [role, setRole] = useState("");
  const [company, setComp] = useState("");
  const [platform, setPlat] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);



  useEffect(() => {

    async function loadJobs(){
      try {
        
        const res = await fetch(API_URL);

        if(!res.ok) throw new Error("Request Failed");

        const data: Job[] = await res.json();

        setJobs(data);
      }
      catch {
        toast.error("Could not load jobs. Is the server running?");
      }
    }

    loadJobs();
  }, []);



  //Handle Dropdowns
  const handleDropDown = () => {
    setOpen(!open);
  };

  function handleStatus(value : string) {
    setStatus(value);
  };


  //Handle Form Inputs
  function handleRoleData(e : React.ChangeEvent<HTMLInputElement>){
    const roleData = e.target.value;
    setRole(roleData);
  };

  function handleCompData(e : React.ChangeEvent<HTMLInputElement>){
    const compData = e.target.value;
    setComp(compData);
  };

  function handlePlatData(e : React.ChangeEvent<HTMLInputElement>){
    const platData = e.target.value;
    setPlat(platData);
  };








  
  async function handleSubmit(){
    if(((role.trim().length) < 1 )|| ((company.trim().length) < 1) || ((platform.trim().length) < 1)){
      toast.error("All inputs must be at least 1 character");
      return;
    }


    if(status === "Select Status"){
      toast.error("Pick a status");
      return;
    }

    try {
      
      const res = await fetch(API_URL, { 
        method: "POST",


        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ role, company, platform, status }),
      })

      const data = await res.json();

      if(!res.ok){
        toast.error(data.error);
        return;
      }

      setJobs((prev) => [data, ...prev]);

      setRole("");
      setComp("");
      setPlat("");
      setStatus("Select Status");
      setOpen(false);

      toast.success("Submitted! Awesome!");
    } catch {
      toast.error("Could not reach the server");
    }
    
    // alert("Submited! Awesome!");
  }



















  // function checkInput(data : string){
  //   if(((data).length) < 1){
  //     toast.error("Input must be at least 1 character");
  //   }

  // }
 

  //Goals
  //Forms? Saving to a DB, and adding CSS, and Routing

  return (
    <>
  
      <nav className="navbar">
       
      </nav>



     {/* THE FORM */}
      <section id = "center">
          <div className="readData">


             <input type="text" placeholder="Type Role Here" value={role} onChange={handleRoleData}></input>
             <input type="text" placeholder="Type Company Here" value={company} onChange={handleCompData}></input>
             <input type={"text"} placeholder='Platform Used' value={platform} onChange={handlePlatData}></input>

              {/* STATUS DROPDOWN */}
             <div className ="dropdown">
                <button onClick={handleDropDown}>{status}</button>
                {open ? (
                  <ul className="statusList">
                    <li className="Select">
                      <button onClick={() => handleStatus("Select Status")}>Select Status</button>
                    </li> 
                    <li className="Pending">
                      <button onClick={() => handleStatus("Pending")}>Pending</button>
                    </li>
                    <li className="Denied">
                      <button onClick={() => handleStatus("Denied")}>Denied</button>
                    </li>
                    <li className="Offered">
                      <button onClick={() => handleStatus("Offered")}>Offered</button>
                    </li>
                  </ul>
                ) : null}
             </div>
             <div>
              <button className="SubmitBtn" onClick={handleSubmit}>Submit</button>
             </div>
          </div>
      </section>



      {/* THE JOB LIST */}
      <section id="joblist">
        <h2>My Applications ({jobs.length})</h2>

        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <strong>{job.role}</strong> at {job.company} via {job.platform} | {job.status} |{" "}
              {new Date(job.applied_date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </section>
      
      {/* Where the toast messages appear */}
      <Toaster/>
      {/* <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section> */}

      </>
  )
}

export default App
