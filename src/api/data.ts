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
interface EmployeeFormData {
  name: string; 
  surname: string; 
  avatar: File | null;
  department_id: number; 
}

export async function createEmployee(data: EmployeeFormData) {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    formData.append("department_id", data.department_id.toString());

    const res = await fetch("https://momentum.redberryinternship.ge/api/employees", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      const responseData = await res.json();
      return responseData;
    }
    throw new Error("Something unexpected happened");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}


export async function getTaskInformation(id: number) {
  try {
      const res = await fetch(`https://momentum.redberryinternship.ge/api/tasks/${id}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      if (!res.ok) {
          throw new Error("Something unexpected happened");
      }

      return await res.json();
  } catch (error) {
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
  }
}






export async function createComment(text: string, taskID: number, parentId?: number) {
  try {
    const commentData = new FormData();
    commentData.append("text", text);
    
    // Append parent_id only if parentId is defined and not null
    if (parentId !== undefined && parentId !== null) {
      commentData.append("parent_id", parentId.toString());
    }

    const res = await fetch(`https://momentum.redberryinternship.ge/api/tasks/${taskID}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: commentData,
    });

    if (res.ok) {
      const responseData = await res.json();
      return responseData;
    }
    throw new Error("Something unexpected happened");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}

export async function getTaskComments(taskIdNumber: number) {
  try {
    const res = await fetch(`https://momentum.redberryinternship.ge/api/tasks/${taskIdNumber}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Something unexpected happened");
    }
    return await res.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
  }
}

export async function updateTaskStatus(id: number, statusId: number): Promise<void> {
  try {
    const res = await fetch(`https://momentum.redberryinternship.ge/api/tasks/${id}`, {
      method: "PUT", 
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status_id: statusId }), 
    });

    if (!res.ok) {
      throw new Error("Failed to update task status");
    }
    const updatedTask = await res.json();
    return updatedTask;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
  }
}