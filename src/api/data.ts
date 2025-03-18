const token = "9e720842-61b7-4e65-b8c2-0319cef40532";
export async function getDepartment() {
  try {
    const res = await fetch(
      "https://momentum.redberryinternship.ge/api/departments"
    );
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    throw new Error("Something unexpected happened");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}

export async function getEmployee() {
  try {
    const res = await fetch(
      "https://momentum.redberryinternship.ge/api/employees",
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    throw new Error("Something unexpected happened");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}
export async function getStatuses() {
  try {
    const res = await fetch(
      "https://momentum.redberryinternship.ge/api/statuses"
    );
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    throw new Error("Something unexpected happened");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}

export async function getTasks() {
  try {
    const res = await fetch(
      "https://momentum.redberryinternship.ge/api/tasks",
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    throw new Error("Something unexpected happened");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}