import { useState, useEffect, useRef, ChangeEvent, MouseEvent } from "react";
import modalX from "../assets/img/modalX.svg";
import asterisk from "../assets/img/astrerisk.svg";
import checkModal from "../assets/img/checkModal.svg";
import trash from "../assets/img/trash.svg";
import arrowdown from "../assets/img/arrowdown.svg";
import photo from "../assets/img/photo.svg";
import greenCheckModal from "../assets/img/greenCheckModal.svg";
import redCheckModal from "../assets/img/redCheckModal.svg";
import { createEmployee, getDepartment } from "../api/data";
import information from "../assets/img/information.svg";

interface Department {
  id: string;
  name: string;
}

interface EmployeeFormData {
  name: string; 
  surname: string; 
  avatar: File | null;
  department_id: number; 
}

interface ValidationState {
  valid: boolean;
  touched: boolean;
  [key: string]: boolean;
}

interface FormValidation {
  name: ValidationState & {
    minLength: boolean;
    maxLength: boolean;
    pattern: boolean;
  };
  surname: ValidationState & {
    minLength: boolean;
    maxLength: boolean;
    pattern: boolean;
  };
  avatar: ValidationState & {
    size: boolean;
    type: boolean;
  };
  department_id: ValidationState;
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    surname: "",
    avatar: null,
    department_id: 0,
  });

  const [validation, setValidation] = useState<FormValidation>({
    name: {
      valid: false,
      minLength: false,
      maxLength: true,
      pattern: false,
      touched: false,
    },
    surname: {
      valid: false,
      minLength: false,
      maxLength: true,
      pattern: false,
      touched: false,
    },
    avatar: { valid: false, size: true, type: true, touched: false },
    department_id: { valid: false, touched: false },
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");

  const [showDepartmentDropdown, setShowDepartmentDropdown] =
    useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartment();
        setDepartments(data);
      } catch {
        setError("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const validateName = (
    name: string,
    field: "name" | "surname"
  ): void => {
    const georgianLatinRegex = /^[a-zA-Zა-ჰ\s]+$/;
    const isMinLength = name.length >= 2;
    const isMaxLength = name.length <= 255;
    const isValidPattern = georgianLatinRegex.test(name);
    const isValid = isMinLength && isMaxLength && isValidPattern;

    setValidation((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        valid: isValid,
        minLength: isMinLength,
        maxLength: isMaxLength,
        pattern: isValidPattern,
        touched: true,
      },
    }));
  };

  const validateAvatar = (file: File | null): void => {
    if (!file) {
      setValidation((prev) => ({
        ...prev,
        avatar: { valid: false, size: true, type: true, touched: true },
      }));
      return;
    }

    const isValidSize = file.size <= 600 * 1024;
    const isValidType = file.type.startsWith("image/");
    const isValid = isValidSize && isValidType;

    setValidation((prev) => ({
      ...prev,
      avatar: {
        valid: isValid,
        size: isValidSize,
        type: isValidType,
        touched: true,
      },
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name" || name === "surname") {
      validateName(value, name);
    } else if (name === "department_id") {
      setValidation((prev) => ({
        ...prev,
        department_id: { valid: !!value, touched: true },
      }));
    }
  };

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      validateAvatar(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = (): void => {
    setFormData((prev) => ({ ...prev, avatar: null }));
    setAvatarPreview(null);
    setValidation((prev) => ({
      ...prev,
      avatar: { valid: false, size: true, type: true, touched: true },
    }));
  };

  const selectDepartment = (id: number): void => {
    setFormData((prev) => ({ ...prev, department_id: id }));
    setValidation((prev) => ({
      ...prev,
      department_id: { valid: true, touched: true },
    }));
    setShowDepartmentDropdown(false);
  };

  const handleSubmit = async (): Promise<void> => {
    const touchedValidation: FormValidation = {
      name: {
        ...validation.name,
        touched: true,
      },
      surname: {
        ...validation.surname,
        touched: true,
      },
      avatar: {
        ...validation.avatar,
        touched: true,
      },
      department_id: {
        ...validation.department_id,
        touched: true,
      },
    };

    setValidation(touchedValidation);

    const isFormValid = Object.values(touchedValidation).every(
      (field) => field.valid
    );

    if (isFormValid) {
      try {
        await createEmployee(formData);
        onClose();
      } catch (error) {
        console.error("Failed to submit form data:", error);
      }
    }
  };

  const resetForm = (): void => {
    setFormData({
      name: "",
      surname: "",
      avatar: null,
      department_id: 0,
    });
    setValidation({
      name: {
        valid: false,
        minLength: false,
        maxLength: true,
        pattern: false,
        touched: false,
      },
      surname: {
        valid: false,
        minLength: false,
        maxLength: true,
        pattern: false,
        touched: false,
      },
      avatar: { valid: false, size: true, type: true, touched: false },
      department_id: { valid: false, touched: false },
    });
    setAvatarPreview(null);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFormValid =
    validation.name.valid &&
    validation.surname.valid &&
    validation.avatar.valid &&
    validation.department_id.valid;

  return (
    <div className="w-full h-full absolute top-[0]  z-50">
      <div className="w-[913px]  absolute  left-1/2 transform -translate-x-1/2 top-[120px]  bg-[#FFF] ">
        <div className="pt-[40px] px-[50px] pb-[60px] flex flex-col gap-[37px] rounded-[10px] border">
          <div ref={modalRef}>
            <div className="flex justify-end">
              <img
                src={modalX}
                alt="close"
                className=" cursor-pointer"
                onClick={onClose}
              />
            </div>
            <div className="flex flex-col gap-[45px]">
              <h1 className=" flex firaGO-font text-[500] text-[32px] text-[#212529] justify-center">
                თანამშრომლის დამატება
              </h1>

              <div className="flex gap-[45px] ">
                <div className="flex flex-col gap-[3px] w-[384px] h-[102px]">
                  <div className="flex">
                    <h2 className="firaGO-font text-[500] text-[14px] text-[#343A40] leading-[0px]">
                      სახელი
                    </h2>
                    <img src={asterisk} alt="required" className="h-2" />
                  </div>
                  <div className="relative w-[384px]">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`border p-[10px] rounded-[6px] w-full ${
                        validation.name.touched &&
                        !validation.name.valid
                          ? "border-[#FA4D4D]"
                          : "border-[#CED4DA]"
                      }`}
                    />
                    <img
                      src={information} 
                      alt="information"
                      className="absolute right-[15px] top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-[2px]">
                    <div className="flex items-center gap-[2px]">
                      <img
                        src={
                          !validation.name.touched
                            ? checkModal
                            : validation.name.minLength
                            ? greenCheckModal
                            : redCheckModal
                        }
                        alt="check"
                        className="w-4 h-4"
                      />
                      <p
                        className={`firaGO-font text-[350] text-[10px] leading-[0px] ${
                          !validation.name.touched
                            ? "text-[#6C757D]"
                            : validation.name.minLength
                            ? "text-[#08A508]"
                            : "text-[#FA4D4D]"
                        }`}
                      >
                        მინიმუმ 2 სიმბოლო
                      </p>
                    </div>
                    <div className="flex items-center gap-[2px]">
                      <img
                        src={
                          !validation.name.touched
                            ? checkModal
                            : validation.name.maxLength
                            ? greenCheckModal
                            : redCheckModal
                        }
                        alt="check"
                        className="w-4 h-4"
                      />
                      <p
                        className={`firaGO-font text-[350] text-[10px] leading-[0px] ${
                          !validation.name.touched
                            ? "text-[#6C757D]"
                            : validation.name.maxLength
                            ? "text-[#08A508]"
                            : "text-[#FA4D4D]"
                        }`}
                      >
                        მაქსიმუმ 255 სიმბოლო
                      </p>
                    </div>
                    <div className="flex items-center gap-[2px]">
                      <img
                        src={
                          !validation.name.touched
                            ? checkModal
                            : validation.name.pattern
                            ? greenCheckModal
                            : redCheckModal
                        }
                        alt="check"
                        className="w-4 h-4"
                      />
                      <p
                        className={`firaGO-font text-[350] text-[10px] leading-[0px] ${
                          !validation.name.touched
                            ? "text-[#6C757D]"
                            : validation.name.pattern
                            ? "text-[#08A508]"
                            : "text-[#FA4D4D]"
                        }`}
                      >
                        მარტო ლათინური და ქართული სიმბოლოები 
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-[3px] w-[384px] h-[102px]">
                  <div className="flex items-center">
                    <h2 className="firaGO-font text-[500] text-[14px] text-[#343A40] leading-[0px]">
                      გვარი
                    </h2>
                    <img src={asterisk} alt="required" className=" h-2 mt-1" />
                  </div>
                  <div className="relative w-[384px]">

                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    className={`border p-[10px] rounded-[6px] w-full ${
                      validation.surname.touched && !validation.surname.valid
                        ? "border-[#FA4D4D]"
                        : "border-[#CED4DA]"
                    }`}
                  />
                   <img
                      src={information} 
                      alt="information"
                      className="absolute right-[15px] top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <div className="flex items-center gap-[2px]">
                      <img
                        src={
                          !validation.surname.touched
                            ? checkModal
                            : validation.surname.minLength
                            ? greenCheckModal
                            : redCheckModal
                        }
                        alt="check"
                        className="w-4 h-4"
                      />
                      <p
                        className={`firaGO-font text-[350] text-[10px] leading-[0px] ${
                          !validation.surname.touched
                            ? "text-[#6C757D]"
                            : validation.surname.minLength
                            ? "text-[#08A508]"
                            : "text-[#FA4D4D]"
                        }`}
                      >
                        მინიმუმ 2 სიმბოლო
                      </p>
                    </div>
                    <div className="flex items-center gap-[2px]">
                      <img
                        src={
                          !validation.surname.touched
                            ? checkModal
                            : validation.surname.maxLength
                            ? greenCheckModal
                            : redCheckModal
                        }
                        alt="check"
                        className="w-4 h-4"
                      />
                      <p
                        className={`firaGO-font text-[350] text-[10px] leading-[0px] ${
                          !validation.surname.touched
                            ? "text-[#6C757D]"
                            : validation.surname.maxLength
                            ? "text-[#08A508]"
                            : "text-[#FA4D4D]"
                        }`}
                      >
                        მაქსიმუმ 255 სიმბოლო
                      </p>
                    </div>
                    <div className="flex items-center gap-[2px]">
                      <img
                        src={
                          !validation.surname.touched
                            ? checkModal
                            : validation.surname.pattern
                            ? greenCheckModal
                            : redCheckModal
                        }
                        alt="check"
                        className="w-4 h-4"
                      />
                      <p
                        className={`firaGO-font text-[350] text-[10px] leading-[0px] ${
                          !validation.surname.touched
                            ? "text-[#6C757D]"
                            : validation.surname.pattern
                            ? "text-[#08A508]"
                            : "text-[#FA4D4D]"
                        }`}
                      >
                        მარტო ლათინური და ქართული სიმბოლოები 
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[8px]">
                <div className="flex">
                  <h2 className="firaGO-font text-[500] text-[14px] text-[#343A40]">
                    ავატარი
                  </h2>
                  <img src={asterisk} alt="required" className="h-2" />
                </div>

                <div
                  className={`border-dashed border-[#CED4DA] h-[120px] rounded-[8px] flex items-center justify-center ${
                    validation.avatar.touched && !validation.avatar.valid
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  {avatarPreview ? (
                    <div className="relative">
                      <div className="w-20 h-20 rounded-[100px] overflow-hidden">
                        <img
                          src={avatarPreview}
                          alt="Avatar Preview"
                          className="w-[88px] h-[88px] object-cover"
                        />
                      </div>
                      <button
                        onClick={removeAvatar}
                        className="absolute bottom-[0px] right-[0px] bg-red-500 rounded-full p-1"
                      >
                        <img src={trash} alt="Remove" className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <div className="flex flex-col  items-center ">
                        <img
                          src={photo}
                          alt="photo"
                          className="w-[24px] h-[24px] flex"
                        />
                        <p className="firaGO-font text-[400] text-[14px] text-[#343A40] leading-[0px]">
                          ატვირთე ფოტო
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {validation.avatar.touched && !validation.avatar.size && (
                  <p className="text-xs text-[#FA4D4D]">
                    სურათის ზომა არ უნდა აღემატებოდეს 600კბ-ს
                  </p>
                )}
                {validation.avatar.touched && !validation.avatar.type && (
                  <p className="text-xs text-[#FA4D4D]">
                    გთხოვთ ატვირთოთ მხოლოდ სურათი
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-[3px] w-[384px]">
                <div className="flex ">
                  <h2 className="firaGO-font text-[500] text-[14px] text-[#343A40]">
                    დეპარტამენტი
                  </h2>
                  <img src={asterisk} alt="required" className="h-2" />
                </div>

                <div className="relative ">
                  <div
                    className={`border border-[#CED4DA] rounded-[6px] p-[10px] flex w-[384px] justify-between items-center ${
                      validation.department_id.touched &&
                      !validation.department_id.valid
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    onClick={() =>
                      setShowDepartmentDropdown(!showDepartmentDropdown)
                    }
                  >
                    <span className="firaGO-font text-[400] text-[14px] text-[#000000]">
                      {selectedDepartmentName || ""}
                    </span>
                    <img
                      src={arrowdown}
                      alt="dropdown"
                      className={`transition-transform ${
                        showDepartmentDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {showDepartmentDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-[#FFF] flex flex-col gap-[11px] border-r-2 border-b-2 border-l-2 border-[#CED4DA] rounded-bl-[6px] rounded-br-[6px] max-h-[85px] overflow-y-auto pt-[5px]">
                      {departments.map((dept) => (
                        <div
                          key={dept.id}
                          className="firaGO-font text-[400] text-[14px] text-[#000000] cursor-pointer"
                          onClick={() => {
                            selectDepartment(Number(dept.id));
                            setSelectedDepartmentName(dept.name);
                          }}
                        >
                          {dept.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-[22px]">
                <button
                  onClick={onClose}
                  className="border border-[#8338EC]  rounded-[5px] py-[10px] px-[16px] gap-[2px] cursor-pointer firaGO-font text-[400] text-[16px] text-[#343A40]"
                >
                  გაუქმება
                </button>
                {loading && <p></p>}
                {error && <p></p>}
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`bg-[#8338EC] rounded-[5px] py-[10px] px-[20px] gap-[4px] cursor-pointer firaGO-font text-[400] text-[18px] text-[#FFFFFF] ${
                    isFormValid
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-purple-300 cursor-not-allowed"
                  }`}
                >
                  დაამატე თანამშრომელი
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
