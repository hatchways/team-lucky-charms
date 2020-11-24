import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import IndividualProject from '../components/IndividualProject';

const Project = () => {
  const [project, setProject] = useState();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();

  useEffect(() => {
    const getProjectDetails = async () => {
      setLoading(true);
      await fetch(`/api/projects/${projectId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((response) => {
          setProject(response);
          setLoading(false);
        })
        .catch((error) => setErrors(error));
    };

    getProjectDetails();
  }, [projectId]);

  if (errors) {
    return <h1>Error retrieving project</h1>;
  }

  return (
    <div>
      {loading ? (
        <h1>Loading project details...</h1>
      ) : (
        <IndividualProject project={project} />
      )}
    </div>
  );
};

export default Project;
