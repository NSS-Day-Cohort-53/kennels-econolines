import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png";
import { useHistory } from "react-router-dom";
import "./Employee.css";

export default ({ employee }) => {
  const [animalCount, setCount] = useState(0);
  const [location, markLocation] = useState({ name: "" });
  const [isEmployee, setAuth] = useState(false);
  const [classes, defineClasses] = useState("card employee");
  const { employeeId } = useParams();
  const { getCurrentUser } = useSimpleAuth();
  const { resolveResource, resource } = useResourceResolver();
  const history = useHistory();

  useEffect(() => {
    if (!employeeId) {
      EmployeeRepository.get(employee.id).then((employeeWithAnimals) => {
        setCount(employeeWithAnimals.animals?. length);
      });
    }
  }, [resource]);

  useEffect(() => {
    if (employeeId) {
      defineClasses("card employee--single1");
    }
    resolveResource(employee, employeeId, EmployeeRepository.get);
  }, []);

  useEffect(() => {
    setAuth(getCurrentUser().employee);
  }, []);

  useEffect(() => {
    if (resource?.employeeLocations?.length > 0) {
      markLocation(resource.employeeLocations[0]);
    }
    console.log("resource changed", resource);
  }, [resource]);
  const deleteEmployee = (id) => {
    fetch(`http://localhost:8088/users/${id}`, {
      method: "DELETE",
    }).then(() => {
      history.go("/users/");
    });
  };

  return (
    <article className={classes}>
      <section className="card-body">
        <img alt="Kennel employee icon" src={person} className="icon--person" />
        <h5 className="card-title">
          {employeeId ? (
            resource.name
          ) : (
            <>
              <Link
                className="card-link"
                to={{
                  pathname: `/employees/${resource.id}`,
                  state: { employee: resource },
                }}
              >
                {resource.name}
              </Link>
              <p>Caring for {`${animalCount}`} animal(s)</p>
            </>
          )}
        </h5>
        {employeeId ? (
          <>
            <section>
              <p>Caring for {`${resource.animals?.length}`} animal(s)</p>
            </section>
            <section>
              <p>
                Working at{" "}
                {`${resource.locations
                  ?.map((location) => location.location.name)
                  .join(", ")}`}
              </p>
            </section>
          </>
        ) : (
          ""
        )}

        {isEmployee ? (
          <Link to={"/employees"}>
            {" "}
            <button
              className="btn--fireEmployee"
              onClick={() => {
                deleteEmployee(resource.id);
              }}
            >
              Fire
            </button>
          </Link>
        ) : (
          ""
        )}
      </section>
    </article>
  );
};
