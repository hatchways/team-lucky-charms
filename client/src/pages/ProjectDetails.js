import React, { useEffect, useState } from 'react';
import IndividualProject from '../components/IndividualProject';

const projectID = window.location.pathname.split('/').pop();

const Project = () => {
  const [project, setProject] = useState();
  const [user, setUser] = useState();
  const [errors, setErrors] = useState(null);
  useEffect(() => {
    const getProjectDetails = async () => {
      await fetch(`/api/projects/${projectID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((response) => {
          setProject(response.project);
          setUser(response.user);
        })
        .catch((error) => setErrors(error));
    };

    getProjectDetails();
  }, []);

  if (errors) {
    return <h1>Error retrieving project</h1>;
  }

  return (
    <>
      {project && user && <IndividualProject project={project} user={user} />}
    </>
  );
};

export default Project;
