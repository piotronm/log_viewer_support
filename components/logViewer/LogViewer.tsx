import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

function LogViewer() {
  const [data, setData] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [logType, setLogType] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [userIdData, setUserIdData] = useState<string[]>([]);
  const [machineData, setMachineData] = useState<string[]>([]);
  const [cewVersion, setCewVersion] = useState<string[]>([]);
  const [startupPath, setStartupPath] = useState("");
  const [moduleNameOptions, setModuleNameOptions] = useState<string[]>([]);
  const [selectedModuleName, setSelectedModuleName] = useState('');
  const [contentNameOptions, setContentNameOptions] = useState<string[]>([]);
  const [selectedContentName, setSelectedContentName] = useState('');
  const [contentIDNameOptions, setContentIDNameOptions] = useState<string[]>([]);
  const [selectedContentIDName, setSelectedContentIDName] = useState('');
  const [errorCount, setErrorCount] = useState<number>(0);
  const [totalLogEntries, setTotalLogEntries] = useState<number>(0);
  const [filteredDataCount, setFilteredDataCount] = useState<number>(0);

  useEffect(() => {
      // Filter data by Module Name
  const moduleNameRegex = /\[([^\[\]]*?[\w-]+[^\[\]]*?)\]/gi;
  const filteredOptions = data.filter(item => moduleNameRegex.test(item));
  // Extract the options within '[' and ']', remove duplicates, and exclude "contentid"
  const moduleNameOptionsSet = new Set<string>(); // Explicitly type the Set
  filteredOptions.forEach(item => {
    const matches = item.match(moduleNameRegex);
    if (matches && matches.length > 0) {
      matches.forEach(match => {
        const option = match.replace('[', '').replace(']', '');
        if (/^[A-Za-z0-9-]+$/.test(option) && !option.toLowerCase().includes('contentid-')) {
          moduleNameOptionsSet.add(option);}});}});
  // Sort the options alphabetically
  const sortedModuleNameOptions = Array.from(moduleNameOptionsSet).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }));
  setModuleNameOptions(sortedModuleNameOptions);
  
// Filter data by Content Identifier Name
const contentIdentifierRegex = /ContentIdentifierName='([^']+)'/g; // Update the regex pattern
const filteredContentNameOptions = data.filter(item => contentIdentifierRegex.test(item));
const contentNameOptionsSet = new Set<string>(); // Explicitly type the Set
filteredContentNameOptions.forEach(item => {
  const matches = item.match(contentIdentifierRegex);
  if (matches && matches.length > 0) {
    matches.forEach(match => {
      const option = match.replace("ContentIdentifierName='", "").replace("'", ""); // Remove single quotes from the option
      contentNameOptionsSet.add(option);
    });
  }
});
const contentNameOptions = Array.from(contentNameOptionsSet);
// Sort the options alphabetically
const sortedContentNameOptions = contentNameOptions.sort((a, b) => a.localeCompare(b));
setContentNameOptions(sortedContentNameOptions);
     
    // Filter data by Content ID 
    const contentIDRegex = /\[contentid-([^[\]]+)\]/gi;
    const filteredContentIDNameOptions = data.filter(item => contentIDRegex.test(item));
    const contentIDNameOptionsSet = new Set<string>(); // Explicitly type the Set
    filteredContentIDNameOptions.forEach(item => {
      const matches = item.match(contentIDRegex);
      if (matches && matches.length > 0) {
        matches.forEach(match => {
          const option = match.replace('[contentid-', '').replace(']', '');
          contentIDNameOptionsSet.add(option);
        });
      }
    });
    const contentIDNameOptions = Array.from(contentIDNameOptionsSet);
    setContentIDNameOptions(contentIDNameOptions);
    const totalLogEntries = data.length;
    setTotalLogEntries(totalLogEntries);
    setFilteredDataCount(filteredData.length); 
  }, [data, searchTerm, logType, selectedModuleName, selectedContentName, selectedContentIDName, startDate, endDate]); // Include relevant dependencies
  
  

  
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
    setFileName(file.name);
    const reader = new FileReader();
  
    if (file.size > 6 * 1024 * 1024) {
      alert('File size is too large. Please select a file under 6 MB');
      event.target.value = '';
      return;
    }
    let lines;
    reader.onload = () => {
      lines = (reader.result as string).split('\n');
      //  const fileName = file.name; This will get the name of the file that each line comes from (will be added when two files can be uploaded at once)
      const convertedData: string[] = lines.map((line: string) => {
        // Skip empty lines
        if (!line.trim()) {
          return "";
        }
      
        const date = moment.utc(line.slice(0, 23)).tz(moment.tz.guess());
        const restOfLine = line.slice(24);
        const convertedDate = date.isValid() ? date.tz(moment.tz.guess()).format('YYYY-MM-DD h:mm:ss A') : "Invalid Date";
        const lineWithFileName = `${convertedDate} ${restOfLine}`; // to add the file name at the end of each line add ${fileName} at the end
        return lineWithFileName;
      }).filter(line => line !== ""); // Remove empty lines from the result
  setData(convertedData);

// Count occurrences of '- error: ['
const errorRegex = /- error: \[/gi;
const errorOccurrences = convertedData.filter(item => errorRegex.test(item)).length;
setErrorCount(errorOccurrences);

 // Extract user IDs from file
const userIdsSet = new Set<string>(); // Explicitly type the Set
const userIdRegex = /"Username":\s*"(.+?)"/i;
lines.forEach((line: string) => {
  const matches = line.match(userIdRegex);
  if (matches && matches[1]) {
    const userId = matches[1];
    userIdsSet.add(userId);
  }
});
const userIds = Array.from(userIdsSet);
setUserIdData(userIds);
/// Extract machine names from file
const machineSet = new Set<string>(); // Explicitly type the Set
const machineRegex = /Machine=([^ ]+)/i;
lines.forEach((line: string) => {
  const matches = line.match(machineRegex);
  if (matches && matches[1]) {
    machineSet.add(matches[1]);
  }
});
const machines: string[] = Array.from(machineSet);
setMachineData(machines);

// Extract CEW Version number from file
const cewVersions = new Set<string>(); // Explicitly type the Set
const cewVersionRegex = /"cewVersion":"([^"]+)"|CEW starting\. CewVersion: ([^ ]+)/i;
lines.forEach((line: string) => {
  const matches = line.match(cewVersionRegex);
  if (matches && (matches[1] || matches[2])) {
    const versionNumber = matches[1] || matches[2];
    cewVersions.add(versionNumber);
  }
});
const cewVersionsArray = Array.from(cewVersions);
setCewVersion(cewVersionsArray);

// Startup Path
const startupPathRegex = /startupArguments:\s*\[([^\]]+)\]/i;
lines.forEach((line: string) => {
  const matches = line.match(startupPathRegex);
  if (matches && matches[1]) {
    setStartupPath(matches[1]);
  }
});
    };
    reader.readAsText(file);
    const fileSizeInMB = Number(file.size) / (1024 * 1024);
    setFileSize(Number(fileSizeInMB.toFixed(3)));
  }
  };

  function resetFilters() {
    setSearchTerm('');
    setLogType('');
    setStartDate(null);
    setEndDate(null);
    setSortOrder('newest');
    setSelectedContentIDName('');
    setSelectedContentName('');
    setSelectedModuleName('');
  }
  
  const handleExport = () => {
    const filterInfo = `Filters:
    File name: ${fileName}
    File size: ${fileSize || 'none'} MB
    User ID: ${userIdData || 'none'}
    Machine: ${machineData || 'none'}
    CEW Version: ${cewVersion || 'none'}
    Startup Path: ${startupPath || 'none'}
    Search term: ${searchTerm || 'none'}
    Log type: ${logType || 'none'}
    Module Name: ${selectedModuleName || 'none'}
    Content Identifier Name: ${selectedContentName || 'none'}
    Content ID Name: ${selectedContentIDName || 'none'}
    Sort order: ${sortOrder}
    Start date: ${startDate || 'none'}
    End date: ${endDate || 'none'}`;
  
    const filteredData = data.filter((item) => {
      // Filter based on search term
      if (searchTerm && !item.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Filter based on log type
      if (logType && !item.toLowerCase().includes(` ${logType.toLowerCase()} `)) {
        return false;
      }
      // Filter based on Module Name
      if (selectedModuleName && !item.includes(`[${selectedModuleName}]`)) {
        return false;
      }
      // Filter based on Content Identifier Name
      if (selectedContentName && !item.includes(`[${selectedContentName}]`)) {
        return false;
      }
      // Filter based on Content ID
      if (selectedContentIDName && !item.includes(`contentid-${selectedContentIDName}`)) {
        return false;
      }
      // Filter based on date range
      if (startDate && moment.utc(item.slice(0, 23)).isBefore(startDate)) {
        return false;
      }
      if (endDate && moment.utc(item.slice(0, 23)).isAfter(endDate)) {
        return false;
      }
      return true;
      
    });
  
    const filteredDataText = `${filterInfo}\n\n${filteredData.join('\n')}`;
    const element = document.createElement('a');
    const file = new Blob([filteredDataText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'filteredData.txt';
    document.body.appendChild(element); 
    element.click();
  };
  
  const handleSearchInput = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
  };

  const handleLogTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setLogType(event.target.value);
  };

  const handleModuleNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedModuleName(event.target.value || ''); // Use empty string as fallback value
  };
  
  const handleContentNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedContentName(event.target.value || ''); // Use empty string as fallback value
  };
  
  const handleContentIDNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedContentIDName(event.target.value || ''); // Use empty string as fallback value
  };

  const handleStartDateChange = (event: { target: { value: any; }; }) => {
    const selectedDate = event.target.value;
    const startDate = selectedDate ? new Date(selectedDate) : null;
    setStartDate(startDate);
  };
  
  const handleEndDateChange = (event: { target: { value: any; }; }) => {
    const selectedDate = event.target.value;
    const endDate = selectedDate ? new Date(selectedDate) : null;
    setEndDate(endDate);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };
  
  const options = {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const filteredData = data
  .filter((item) => {
    // Filter based on searchTerm
    if (searchTerm && !item.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Filter based on logType
    if (logType && !item.toLowerCase().includes(logType.toLowerCase())) {
      return false;
    }
    // Filter based on Module Name
    if (selectedModuleName && !item.toLowerCase().includes(selectedModuleName.toLowerCase())) {
      return false;
    }
    // Filter based on Content Identifier Name
    if (selectedContentName && !item.toLowerCase().includes(selectedContentName.toLowerCase())) {
      return false;
    }
    // Filter based on Content ID Name
    if (selectedContentIDName && !item.toLowerCase().includes(selectedContentIDName.toLowerCase())) {
      return false;
    }
    // Filter based on startDate
    if (startDate && new Date(item.split(" ")[0]) < startDate) {
      return false;
    }
    // Filter based on endDate
    if (endDate && new Date(item.split(" ")[0]) > endDate) {
      return false;
    }
    return true;
  })
  .sort((a, b) => {
    const dateA = new Date(a.split(" ")[0] + " " + a.split(" ")[1] + " " + options.timeZone);
    const dateB = new Date(b.split(" ")[0] + " " + b.split(" ")[1] + " " + options.timeZone);
    if (sortOrder === "newest") {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });

if (sortOrder === "oldest") {
  filteredData.reverse();
}

const handleAboutClick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleContactClick = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};
  
  return (
    <div id='top'>
      <div >
      <div >
        <input  title='Upload File' type="file" id='file-upload' onChange={handleFileUpload} />
        <button  onClick={handleExport}>Export</button>
        <button onClick={() => window.location.reload()}>Clear Log File</button>
        <button  onClick={resetFilters}>Reset Filters</button>
        <input type="text"  value={searchTerm} onChange={handleSearchInput} placeholder='Search' />
        <button  onClick={toggleSortOrder}>Currently Displaying {sortOrder === "newest" ? "Oldest - Newest" : "Newest - Oldest"}</button>
        <Link to="/" >Support Portal</Link>
        <label>Total Filtered Entries: {filteredDataCount}</label>
      </div>
      <div >
        <label  htmlFor="log-types">Log Level:</label>
        <select  id="log-types" value={logType} onChange={handleLogTypeChange}>
          <option value="">All</option>
          <option value="- Info:">Info</option>
          <option value="- Warn:">Warn</option>
          <option value="- Error:">Error</option>
        </select>
        <label  htmlFor="module-name-dropdown">Module Name:</label>
          <select  id="module-name-dropdown" value={selectedModuleName} onChange={handleModuleNameChange}>
            <option value="">All</option>
            {moduleNameOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        <label  htmlFor="content-name-dropdown">Content Identifier Name:</label>
        <select  id="content-name-dropdown" value={selectedContentName} onChange={handleContentNameChange}>
          <option value="">All</option>
          {contentNameOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <label  htmlFor="contentID-name-dropdown">Content ID:</label>
        <select  id="contentID-name-dropdown" value={selectedContentIDName} onChange={handleContentIDNameChange}>
          <option value="">All</option>
          {contentIDNameOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        </div>
        <div >
          <label >Total Errors: {errorCount}</label>
          <label>Total Log Entries: {totalLogEntries}</label>
          <label >Start Date and Time:</label>
          <input id='datetime-id' type="datetime-local" onChange={handleStartDateChange} />
          <label >End Date and Time:</label>
          <input  type="datetime-local" onChange={handleEndDateChange} />
          <button  onClick={handleContactClick}>Bottom of Page</button>
        </div>
        </div>
        <div >
          <label >File Name: <strong >{fileName}</strong></label>
          <label >File size: <strong >{fileSize}</strong> <label >MB</label></label>
            <label >User ID:</label>
            {userIdData.map((userId, index) => (
            <strong  key={index}>{`${index > 0 ? ', ' : ''}${userId}`}</strong>))}        
          <label >Machine: 
            {machineData.map((machineData, index) => ( 
            <strong  key={index}>{`${index > 0 ? ', ' : ' '}${machineData}`}</strong>))}      
          </label>
          <label >CEW Version: <strong >{cewVersion}</strong></label>
          <label >Startup Path: <strong >{startupPath}</strong></label>
        </div>
        <div >
          <ul >
            {filteredData.map((item, index) => {
            const parts = item.split(',');
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const partsHighlighted = parts[0].split(regex);
            const display = searchTerm ? (
          <span>
            {partsHighlighted.map((part, i) =>
            regex.test(part) ? <mark key={i} >{part}</mark> : part
            )}
            - {parts[1]}
          </span>
          ) : (
          <span>{item}</span>
          );
          return (
            <li key={index} >
              {display}
            </li>
          );
          })}
          </ul>
        </div>
      <div id='bottom'>
      <button  onClick={handleAboutClick}>Top of Page</button>
      </div>
  </div>
  );    
}
export default LogViewer;
