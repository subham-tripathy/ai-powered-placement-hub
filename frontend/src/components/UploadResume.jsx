import { useContext, useState, useRef } from "react";
import { API } from "./functions";
import { LoginContext } from "./ContextProvider";
import { jwtDecode } from "jwt-decode";

export default function UploadResume() {
  const { user } = useContext(LoginContext);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const studentId = jwtDecode(user).id;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || 
          selectedFile.type === "application/msword" ||
          selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setFile(selectedFile);
        setMessage("");
      } else {
        setMessage("Please upload a PDF or Word document.");
        setMessageType("error");
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || 
          droppedFile.type === "application/msword" ||
          droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setFile(droppedFile);
        setMessage("");
      } else {
        setMessage("Please upload a PDF or Word document.");
        setMessageType("error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file first.");
      setMessageType("error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("id", studentId);

    try {
      const response = await fetch(`${API}/upload-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Resume uploaded successfully!");
        setMessageType("success");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setMessage(data.error || "Upload failed.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Something went wrong.");
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  // const handleDownload = async () => {
  //   setDownloading(true);
  //   try {
  //     const response = await fetch(`${API}/download-resume`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ studentId }),
  //     });

  //     if (!response.ok) {
  //       setMessage("Resume not found or download failed.");
  //       setMessageType("error");
  //       return;
  //     }

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `resume_${studentId}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
      
  //     setMessage("Resume downloaded successfully!");
  //     setMessageType("success");
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //     setMessage("Something went wrong during download.");
  //     setMessageType("error");
  //   } finally {
  //     setDownloading(false);
  //   }
  // };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg style={styles.headerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h1 style={styles.title}>Resume Manager</h1>
          <p style={styles.subtitle}>Upload or download your professional resume</p>
        </div>

        {/* Download Section */}

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>or upload a new resume</span>
        </div>

        {/* Upload Section */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              ...styles.dropzone,
              ...(dragActive ? styles.dropzoneActive : {}),
              ...(file ? styles.dropzoneWithFile : {}),
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              style={styles.hiddenInput}
            />
            
            {!file ? (
              <>
                <div style={styles.uploadIconContainer}>
                  <svg style={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p style={styles.dropzoneTitle}>
                  {dragActive ? "Drop your file here" : "Drag & drop your resume here"}
                </p>
                <p style={styles.dropzoneSubtitle}>or click to browse</p>
                <p style={styles.fileTypes}>Supports PDF, DOC, DOCX</p>
              </>
            ) : (
              <div style={styles.filePreview}>
                <div style={styles.fileIconContainer}>
                  <svg style={styles.fileIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div style={styles.fileInfo}>
                  <p style={styles.fileName}>{file.name}</p>
                  <p style={styles.fileSize}>{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  style={styles.removeButton}
                >
                  <svg style={styles.removeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.uploadButton,
              opacity: uploading || !file ? 0.7 : 1,
              cursor: uploading || !file ? "not-allowed" : "pointer",
            }}
            disabled={uploading || !file}
          >
            {uploading ? (
              <>
                <span style={styles.spinner}></span>
                Uploading...
              </>
            ) : (
              <>
                <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Resume
              </>
            )}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div
            style={{
              ...styles.message,
              ...(messageType === "success" ? styles.successMessage : styles.errorMessage),
            }}
          >
            <svg style={styles.messageIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {messageType === "success" ? (
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              )}
            </svg>
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    padding: "40px",
    width: "100%",
    maxWidth: "500px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  iconContainer: {
    width: "70px",
    height: "70px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  headerIcon: {
    width: "35px",
    height: "35px",
    color: "#ffffff",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0",
  },
  downloadSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "25px",
    gap: "15px",
    flexWrap: "wrap",
  },
  downloadInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  downloadIcon: {
    width: "40px",
    height: "40px",
    color: "#667eea",
  },
  downloadTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a2e",
    margin: "0 0 4px 0",
  },
  downloadText: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0",
  },
  downloadButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#667eea",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  divider: {
    textAlign: "center",
    position: "relative",
    marginBottom: "25px",
  },
  dividerText: {
    background: "#ffffff",
    padding: "0 15px",
    color: "#9ca3af",
    fontSize: "13px",
    position: "relative",
    zIndex: 1,
  },
  dropzone: {
    border: "2px dashed #d1d5db",
    borderRadius: "16px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: "20px",
    background: "#fafafa",
  },
  dropzoneActive: {
    border: "2px dashed #667eea",
    background: "#f0f4ff",
  },
  dropzoneWithFile: {
    border: "2px solid #667eea",
    background: "#f0f4ff",
    padding: "20px",
  },
  hiddenInput: {
    display: "none",
  },
  uploadIconContainer: {
    width: "60px",
    height: "60px",
    background: "#e0e7ff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
  },
  uploadIcon: {
    width: "28px",
    height: "28px",
    color: "#667eea",
  },
  dropzoneTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 5px 0",
  },
  dropzoneSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 10px 0",
  },
  fileTypes: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: "0",
  },
  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    textAlign: "left",
  },
  fileIconContainer: {
    width: "50px",
    height: "50px",
    background: "#667eea",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fileIcon: {
    width: "24px",
    height: "24px",
    color: "#ffffff",
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a2e",
    margin: "0 0 4px 0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  fileSize: {
    fontSize: "12px",
    color: "#6b7280",
    margin: "0",
  },
  removeButton: {
    width: "36px",
    height: "36px",
    background: "#fee2e2",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.3s ease",
  },
  removeIcon: {
    width: "18px",
    height: "18px",
    color: "#ef4444",
  },
  uploadButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonIcon: {
    width: "20px",
    height: "20px",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid #ffffff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  message: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },
  successMessage: {
    background: "#d1fae5",
    color: "#065f46",
  },
  errorMessage: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  messageIcon: {
    width: "20px",
    height: "20px",
    flexShrink: 0,
  },
};

// Add this CSS to your global styles or in a style tag
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);