const fetchGraphql = async (query) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(query),
  };
  try {
    const response = await fetch("http://localhost:3000/graphql", options);
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const saveAnimal = async (message) => {
  const query = {
    query: `mutation {
              addAnimal(animalName: $animalName, species: $species){
                id
                animalName
              }
            }`,
    variables: message,
  };
  const data = await fetchGraphql(query);
  return data.addAnimal;
};

const getAnimals = async (user) => {
  const otherQuery = {
    query: `
    {
        animals {
          id
          animalName
          species {
            speciesName
            category {
              categoryName
            }
          }
        }
      }`,
  };
  const data = await fetchGraphql(otherQuery);
  return data.animals;
};
