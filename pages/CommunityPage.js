import React, {useState, useEffect} from 'react';
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
  Modal,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';

const NEWS_API_URL = 'http://10.10.11.236:5000/news?location=Chicago'; // Replace with your backend API

// Dummy News Data (Crime & Safety in Chicago)
const dummyNewsData = [
  {
    author: 'John Doe',
    title: 'Chicago Implements New Safety Measures to Protect Women at Night',
    description:
      'The city has introduced new street lighting and emergency response stations.',
    url: 'https://www.bbc.com/news',
    urlToImage:
      'https://media.istockphoto.com/id/1163652344/photo/woman-walking-at-night-in-the-city.jpg?s=612x612&w=0&k=20&c=_c-8DGkwe6-q_QSGkSY9ETH_O-vpAtWqFaNjCs56MC0=', // Replace with actual image later
    publishedAt: '2025-02-05T16:55:58Z',
  },
  {
    author: 'Jane Smith',
    title: 'Child Safety Program Expands Across Chicago Schools',
    description:
      'New self-defense training and awareness programs launched for school children.',
    url: 'https://www.bbc.com/news',
    urlToImage:
      'https://media.istockphoto.com/id/1011642904/photo/cute-asian-pupil-girl-with-backpack-holding-her-mother-hand-and-going-to-school.jpg?s=612x612&w=0&k=20&c=pijRndwZZqv-M66pMtC0wlZngwGsBDSbf281TGHpyPQ=',
    publishedAt: '2025-02-03T12:30:20Z',
  },
  {
    author: 'Emily Johnson',
    title: 'Crime Rates Drop in Downtown Chicago Amid New Policing Strategies',
    description:
      'Recent data shows a 15% decrease in violent crimes due to increased patrols.',
    url: 'https://www.bbc.com/news',
    urlToImage:
      'https://media.gettyimages.com/id/895729708/photo/chicago-il-demonstrators-protest-outside-of-the-office-of-senator-dick-durbin-urging-him-to.jpg?s=612x612&w=0&k=20&c=0Gg4T8xOofhNZjr2mL_L_0dUWvHo7EWybRcs6Dbn8Uc=',
    publishedAt: '2025-01-30T09:12:45Z',
  },
  {
    author: 'Michael Brown',
    title: 'Chicago Introduces Panic Button App for Women’s Safety',
    description:
      'A new emergency response app allows women to send distress signals to local authorities.',
    url: 'https://www.bbc.com/news',
    urlToImage:
      'https://media.gettyimages.com/id/1246654726/photo/sos-emergency-call-sign-displayed-on-a-phone-screen-is-seen-in-this-illustration-photo-taken.jpg?s=612x612&w=0&k=20&c=8vUUtUj7bjIDK1lBqYfONxl7_iJJxc5NEJxbHcEIHvc=',
    publishedAt: '2025-01-25T14:25:10Z',
  },
  {
    author: 'Sarah Thompson',
    title: 'Local NGOs Organize Self-Defense Workshops for Women and Children',
    description:
      'Workshops across the city teach basic self-defense techniques and awareness strategies.',
    url: 'https://www.bbc.com/news',
    urlToImage:
      'https://media.gettyimages.com/id/658294976/photo/woman-self-defense-trick-against-the-mans-attack-strong-women-practicing-self-defense-martial.jpg?s=612x612&w=0&k=20&c=la_hCmFvuME2WB_2OdVITf3qF0mlT9mCmsbE9EprxmY=',
    publishedAt: '2025-01-20T18:40:35Z',
  },
];

const CommunityPage = () => {
  const [reports, setReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [newsData, setNewsData] = useState(dummyNewsData); // Dummy data first
  const [loadingNews, setLoadingNews] = useState(true);

  const [formData, setFormData] = useState({
    vict_age: '',
    vict_sex: 'F',
    location: '',
    crm_cd_desc: '',
  });

  // Gender Dropdown State
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [genderOptions] = useState([
    {label: 'Female', value: 'F'},
    {label: 'Male', value: 'M'},
    {label: 'Other', value: 'O'},
  ]);

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('Fetching news from API...');
        const response = await fetch(NEWS_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.news) {
          setNewsData(data.news);
        } else {
          console.log('No news articles found.');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  // Handle Report Submission
  const handleSubmitReport = async () => {
    if (!formData.vict_age || !formData.location || !formData.crm_cd_desc) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      console.log('Submitting report:', JSON.stringify(formData, null, 2));

      const response = await fetch('http://192.168.14.170:3000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vict_age: Number(formData.vict_age),
          vict_sex: formData.vict_sex ? String(formData.vict_sex).trim() : '', // Ensure string
          location: formData.location ? String(formData.location).trim() : '',
          crm_cd_desc: formData.crm_cd_desc
            ? String(formData.crm_cd_desc).trim()
            : '',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('✅ Report Submitted Successfully:', responseData);

      setReports(prevReports => [
        {...formData, id: prevReports.length},
        ...prevReports,
      ]);

      setModalVisible(false);
      setSuccessModalVisible(true);

      setTimeout(() => {
        setSuccessModalVisible(false);
      }, 2000);

      setFormData({
        vict_age: '',
        vict_sex: 'F',
        location: '',
        crm_cd_desc: '',
      });
    } catch (error) {
      console.error('❌ Error submitting report:', error.message || error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* INCIDENT REPORTS SECTION */}
      {reports.length > 0 && (
        <>
          <View style={styles.incidentHeader}>
            <Text style={styles.subHeading}>RECENT INCIDENTS</Text>
          </View>
          <FlatList
            data={reports}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity style={styles.reportCard}>
                <Text style={styles.reportTitle}>{item.crm_cd_desc}</Text>
                <View style={styles.reportFooter}>
                  <Text style={styles.reportDetails}>
                    {item.location} | Age: {item.vict_age}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* NEWS HEADER & REPORT BUTTON */}
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>NEWS</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.reportButton}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/595/595067.png',
            }}
            style={styles.reportIcon}
          />
          <Text style={styles.reportText}>Report Incident</Text>
        </TouchableOpacity>
      </View>

      {/* NEWS LIST */}
      <FlatList
        data={newsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => Linking.openURL(item.url)}
            style={styles.card}>
            <View>
              <Image source={{uri: item.urlToImage}} style={styles.newsImage} />
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDescription}>{item.description}</Text>
              <View style={styles.newsFooter}>
                <Text style={styles.newsDate}>{item.publishedAt}</Text>
                <Text style={styles.newsAuthor}>{item.author}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* MODAL FOR REPORTING INCIDENT */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Incident</Text>

            {/* Age Input */}
            <TextInput
              style={styles.input}
              placeholder="Victim Age *"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={formData.vict_age}
              onChangeText={text => setFormData({...formData, vict_age: text})}
            />

            {/* Gender Dropdown */}
            <DropDownPicker
              open={genderDropdownOpen}
              value={formData.vict_sex}
              items={genderOptions}
              setOpen={setGenderDropdownOpen}
              setValue={value =>
                setFormData(prev => ({...prev, vict_sex: value}))
              }
              containerStyle={styles.pickerContainer}
              style={styles.picker}
            />

            {/* Location Input */}
            <TextInput
              style={styles.input}
              placeholder="Location *"
              placeholderTextColor="#666"
              value={formData.location}
              onChangeText={text => setFormData({...formData, location: text})}
            />

            {/* Crime Description */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Crime Description *"
              placeholderTextColor="#666"
              multiline
              value={formData.crm_cd_desc}
              onChangeText={text =>
                setFormData({...formData, crm_cd_desc: text})
              }
            />
          </View>

          {/* Submit & Cancel Buttons */}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReport}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS GIF MODAL */}
      <Modal visible={successModalVisible} transparent={true}>
        <View style={styles.successModal}>
          <Image
            source={{
              uri: 'https://cdn-icons-gif.flaticon.com/17702/17702135.gif',
            }}
            style={styles.successGif}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CommunityPage;

/** 🔹 STYLES 🔹 **/
const styles = StyleSheet.create({
  container: {flexGrow: 1, backgroundColor: '#F9F9F9', padding: 15},

  /** HEADER **/
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {fontSize: 24, fontWeight: 'bold', color: '#222'},
  // reportButton: { backgroundColor: '#007BFF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  // reportText: { color: '#FFF', fontWeight: 'bold' },

  reportButton: {
    flexDirection: 'row', // Aligns icon and text
    alignItems: 'center',
    backgroundColor: '#ff474c', // Bold Red for Urgency
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50, // Fully rounded button
    shadowColor: '#D90429', // Red glow effect
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Works on Android
  },

  reportText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8, // Space between icon and text
  },
  reportIcon: {
    width: 20,
    height: 20,
    // tintColor: '#FFF', // Ensures icon blends well
  },

  /** NEWS SECTION **/
  card: {
    backgroundColor: '#f0f0ec',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
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
  newsDate: {fontSize: 12, color: '#777'},
  newsAuthor: {fontSize: 12, color: '#777', textAlign: 'right'},

  /** MODAL **/
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  /** INPUT FIELDS **/
  inputWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    color: '#000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  /** UPLOAD BUTTON **/
  uploadButton: {
    backgroundColor: '#006db5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  uploadText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** BUTTONS **/
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#198754',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {color: '#FFF'},

  /*** 🔹 INCIDENT REPORT STYLES 🔹 ***/
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    //   marginBottom: 10,
    color: '#222',
  },
  reportCard: {
    backgroundColor: '#f0f0ec',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    // elevation: 5, // Slight shadow for cards
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
});
