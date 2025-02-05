import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

// Dummy News Data (Crime & Safety in Chicago)
const newsData = [
    {
      author: "John Doe",
      title: "Chicago Implements New Safety Measures to Protect Women at Night",
      description: "The city has introduced new street lighting and emergency response stations.",
      url: "https://www.bbc.com/news",
      urlToImage: "https://media.istockphoto.com/id/1163652344/photo/woman-walking-at-night-in-the-city.jpg?s=612x612&w=0&k=20&c=_c-8DGkwe6-q_QSGkSY9ETH_O-vpAtWqFaNjCs56MC0=", // Replace with actual image later
      publishedAt: "2025-02-05T16:55:58Z",
    },
    {
      author: "Jane Smith",
      title: "Child Safety Program Expands Across Chicago Schools",
      description: "New self-defense training and awareness programs launched for school children.",
      url: "https://www.bbc.com/news",
      urlToImage: "https://media.istockphoto.com/id/1011642904/photo/cute-asian-pupil-girl-with-backpack-holding-her-mother-hand-and-going-to-school.jpg?s=612x612&w=0&k=20&c=pijRndwZZqv-M66pMtC0wlZngwGsBDSbf281TGHpyPQ=",
      publishedAt: "2025-02-03T12:30:20Z",
    },
    {
      author: "Emily Johnson",
      title: "Crime Rates Drop in Downtown Chicago Amid New Policing Strategies",
      description: "Recent data shows a 15% decrease in violent crimes due to increased patrols.",
      url: "https://www.bbc.com/news",
      urlToImage: "https://media.gettyimages.com/id/895729708/photo/chicago-il-demonstrators-protest-outside-of-the-office-of-senator-dick-durbin-urging-him-to.jpg?s=612x612&w=0&k=20&c=0Gg4T8xOofhNZjr2mL_L_0dUWvHo7EWybRcs6Dbn8Uc=",
      publishedAt: "2025-01-30T09:12:45Z",
    },
    {
      author: "Michael Brown",
      title: "Chicago Introduces Panic Button App for Women’s Safety",
      description: "A new emergency response app allows women to send distress signals to local authorities.",
      url: "https://www.bbc.com/news",
      urlToImage: "https://media.gettyimages.com/id/1246654726/photo/sos-emergency-call-sign-displayed-on-a-phone-screen-is-seen-in-this-illustration-photo-taken.jpg?s=612x612&w=0&k=20&c=8vUUtUj7bjIDK1lBqYfONxl7_iJJxc5NEJxbHcEIHvc=",
      publishedAt: "2025-01-25T14:25:10Z",
    },
    {
      author: "Sarah Thompson",
      title: "Local NGOs Organize Self-Defense Workshops for Women and Children",
      description: "Workshops across the city teach basic self-defense techniques and awareness strategies.",
      url: "https://www.bbc.com/news",
      urlToImage: "https://media.gettyimages.com/id/658294976/photo/woman-self-defense-trick-against-the-mans-attack-strong-women-practicing-self-defense-martial.jpg?s=612x612&w=0&k=20&c=la_hCmFvuME2WB_2OdVITf3qF0mlT9mCmsbE9EprxmY=",
      publishedAt: "2025-01-20T18:40:35Z",
    },
  ];

// Default Incident Icons (Loop through these)
const incidentIcons = [
  "https://cdn-icons-png.flaticon.com/128/4140/4140633.png",
  "https://cdn-icons-png.flaticon.com/128/9897/9897145.png",
  "https://cdn-icons-png.flaticon.com/512/14779/14779592.png",
  "https://cdn-icons-png.flaticon.com/512/14779/14779572.png",
];

// Convert date format to DD-MM-YYYY
const formatDate = (isoDate) => {
  const dateObj = new Date(isoDate);
  return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
};

const CommunityPage = () => {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0], // Auto-filled with today’s date
    hasEvidence: false,
    evidenceImg: '',
  });

  // Handle Image Upload for Evidence
  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setFormData({ ...formData, hasEvidence: true, evidenceImg: response.assets[0].uri });
      }
    });
  };

  // Handle Form Submission
  const handleSubmitReport = () => {
    if (!formData.title || !formData.location) {
      alert('Please fill all required fields.');
      return;
    }

    setReports([...reports, { ...formData, id: reports.length }]);
    setFormData({
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      hasEvidence: false,
      evidenceImg: '',
    });
    setShowForm(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* NEWS HEADING + REPORT INCIDENT BUTTON */}
      {!showForm && reports.length === 0 && (
        <View style={styles.headerContainer}>
            <Text style={styles.heading}>NEWS</Text>
            <TouchableOpacity onPress={() => setShowForm(true)} style={styles.reportButton}>
            <Text style={styles.reportText}>Report Incident ⚠️</Text>
            </TouchableOpacity>
        </View>
        )}


      {showForm && (
        <View style={styles.headerContainer}>
        {/* <Text style={styles.heading}>NEWS</Text> */}
        <TouchableOpacity onPress={() => setShowForm(true)} style={styles.reportButton}>
          <Text style={styles.reportText}>Report Incident ⚠️</Text>
        </TouchableOpacity>
      </View>
      )}

      {/* INCIDENT FORM (Hidden Until "Report Incident" Clicked) */}
        {showForm && (
        <View style={styles.formContainer}>
            
            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowForm(false)}>
            <Image 
                source={{ uri: "https://cdn-icons-png.flaticon.com/128/10407/10407098.png" }} 
                style={styles.cancelIcon} 
            />
            </TouchableOpacity>

            {/* Adding extra padding to ensure proper spacing */}
            <View style={styles.formContent}>

            <Text style={styles.inputLabel}>Incident Title *</Text>
            <TextInput style={styles.input} value={formData.title} onChangeText={(text) => setFormData({ ...formData, title: text })} />

            <Text style={styles.inputLabel}>Location *</Text>
            <TextInput style={styles.input} value={formData.location} onChangeText={(text) => setFormData({ ...formData, location: text })} />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput style={styles.input} multiline value={formData.description} onChangeText={(text) => setFormData({ ...formData, description: text })} />

            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                <Text style={styles.uploadText}>Upload Proof (Optional)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReport}>
                <Text style={styles.submitText}>Submit Report</Text>
            </TouchableOpacity>

            </View>

        </View>
        )}



      {/* INCIDENT REPORTS SECTION (Only appears if reports exist) */}
      {reports.length > 0 && (
        <>
        <View style={styles.incidentHeader}>
            <Text style={styles.subHeading}>RECENT INCIDENTS</Text>
            {!showForm && (
                <TouchableOpacity onPress={() => setShowForm(true)} style={styles.reportButton}>
            <Text style={styles.reportText}>Report Incident ⚠️</Text>
            </TouchableOpacity>
            )}
        </View>
          
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.reportCard}>
                <Text style={styles.reportTitle}>{item.title}</Text>
                {item.description!= '' && (<Text style={styles.reportAuthor}>{item.description}</Text>)}
                <View style={styles.reportFooter}>
                  <Text style={styles.reportDetails}>{item.location} | {formatDate(item.date)}</Text>
                  <Image source={{ uri: incidentIcons[index % incidentIcons.length] }} style={styles.incidentIcon} />
                </View>
                <Text style={styles.reportAuthor}>John Doe</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

{(reports.length > 0 || showForm) && (
    <View style={styles.separatorContainer}>
        <View style={styles.headerContainer}>
            <Text style={styles.heading}>NEWS</Text>
        </View>
    </View>
)}




      {/* NEWS LIST */}
      <FlatList
        data={newsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => Linking.openURL(item.url)} style={styles.shadowContainer}>
            <View style={styles.card}>
              <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDescription}>{item.description}</Text>
              <View style={styles.newsFooter}>
                <Text style={styles.newsDate}>{formatDate(item.publishedAt)}</Text>
                <Text style={styles.newsAuthor}>{item.author}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

export default CommunityPage;


const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#F9F9F9',
      padding: 15,
    },
  
    /*** 🔹 INCIDENT REPORT STYLES 🔹 ***/
    subHeading: {
      fontSize: 18,
      fontWeight: 'bold',
    //   marginBottom: 10,
      color: '#222',
    },
    reportCard: {
      backgroundColor: '#FFF',
      padding: 12,
      marginBottom: 10,
      borderRadius: 8,
      elevation: 5, // Slight shadow for cards
    },
    reportTitle: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    reportFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 5,
    },
    reportDetails: {
      fontSize: 12,
      color: '#666',
    },
    incidentIcon: {
      width: 40,
      height: 40,
    },
  
    /*** 🔹 HEADER STYLES (For News & Reports) 🔹 ***/
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    incidentHeader: {
        flexDirection: 'row',  // Places items in a row (side by side)
        justifyContent: 'space-between',  // Ensures even spacing between elements
        alignItems: 'center',  // Aligns text and button vertically
        paddingHorizontal: 6,  // Adds padding on left & right for spacing
        marginBottom: 15,  // Creates spacing below the header
      },      
    reportsVisible: {
      marginBottom: 20, // Adds spacing when reports are shown
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#222',
    },
    reportButton: {
      backgroundColor: '#007BFF',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    reportText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
  
    /*** 🔹 FORM STYLES 🔹 ***/
    formContainer: {
        backgroundColor: '#EAEAEA',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        position: 'relative',
    },
    inputLabel: {
      fontWeight: 'bold',
      marginTop: 10,
    },
    input: {
      backgroundColor: '#FFF',
      padding: 8,
      borderRadius: 6,
      marginTop: 5,
    },
    uploadButton: {
      marginTop: 10,
      backgroundColor: '#007BFF',
      padding: 8,
      borderRadius: 6,
    },
    submitButton: {
      marginTop: 10,
      backgroundColor: '#28A745',
      padding: 8,
      borderRadius: 6,
    },
  
    /*** 🔹 NEWS SECTION STYLES (Unchanged & Fully Integrated) 🔹 ***/
    shadowContainer: {
      borderRadius: 12, // Ensures the shadow follows rounded corners
      backgroundColor: 'transparent',
      elevation: 6, // Works for Android
      marginBottom: 15, // Adds spacing between cards
    },
    card: {
      backgroundColor: '#F2F0EF',
      borderRadius: 12,
      padding: 14,
      overflow: 'hidden', // Ensures the content stays within the rounded border
    },
    newsImage: {
      width: '100%',
      height: 180,
      borderRadius: 10,
    },
    newsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111',
      marginTop: 10,
    },
    newsDescription: {
      fontSize: 14,
      color: '#555',
      marginTop: 5,
    },
    newsFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    newsDate: {
      fontSize: 12,
      color: '#777',
    },
    newsAuthor: {
      fontSize: 12,
      color: '#777',
      textAlign: 'right',
    },
    separatorContainer: {
        marginTop: 20, // Adjust as needed for spacing
        borderTopWidth: 2,
        borderTopColor: '#E0E0E0', // Light grey for a subtle effect
        paddingTop: 10, // Adds spacing between the border and heading
    },
    cancelButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
        zIndex: 10, 
    },
    
    cancelIcon: {
        width: 24, 
        height: 24,
        tintColor: '#333',
        opacity: 0.8, 
    },
    formContent: {
        paddingTop: 10, // Adds space below cancel button
    },
  });
  