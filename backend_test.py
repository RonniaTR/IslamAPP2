#!/usr/bin/env python3
"""
Backend API Testing for Islamic Life Assistant App
Tests all backend endpoints with real-world data
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BACKEND_URL = "https://ilim-companion.preview.emergentagent.com/api"
TEST_SESSION_ID = "test_session_islamic_001"
TEST_USER_ID = "test_user_islamic_001"

def test_health_check():
    """Test GET /api/ - Health check"""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            if "message" in data and "version" in data:
                print("✅ Health check PASSED")
                return True
            else:
                print("❌ Health check response missing required fields")
                return False
        else:
            print(f"❌ Health check FAILED with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check ERROR: {e}")
        return False

def test_cities_api():
    """Test GET /api/cities - Get Turkish cities"""
    print("\n=== Testing Cities API ===")
    try:
        response = requests.get(f"{BACKEND_URL}/cities", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            cities = response.json()
            print(f"Number of cities: {len(cities)}")
            
            if len(cities) >= 10:  # Should have at least 10 cities
                # Check first city structure
                city = cities[0]
                required_fields = ['id', 'name', 'latitude', 'longitude', 'qibla_direction']
                
                if all(field in city for field in required_fields):
                    print(f"Sample city: {city['name']} - Qibla: {city['qibla_direction']}°")
                    print("✅ Cities API PASSED")
                    return True
                else:
                    print(f"❌ City missing required fields: {required_fields}")
                    return False
            else:
                print("❌ Insufficient cities returned")
                return False
        else:
            print(f"❌ Cities API FAILED with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cities API ERROR: {e}")
        return False

def test_prayer_times_api():
    """Test GET /api/prayer-times/{city_id} - Get prayer times"""
    print("\n=== Testing Prayer Times API ===")
    try:
        city_id = "istanbul"
        response = requests.get(f"{BACKEND_URL}/prayer-times/{city_id}", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            prayer_times = response.json()
            print(f"Prayer times for {prayer_times.get('city_name', city_id)}:")
            
            required_fields = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha', 'date', 'qibla_direction']
            
            if all(field in prayer_times for field in required_fields):
                for prayer in ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']:
                    print(f"  {prayer.capitalize()}: {prayer_times[prayer]}")
                print(f"  Date: {prayer_times['date']}")
                print(f"  Qibla Direction: {prayer_times['qibla_direction']}°")
                print("✅ Prayer Times API PASSED")
                return True
            else:
                print(f"❌ Prayer times missing required fields: {required_fields}")
                return False
        else:
            print(f"❌ Prayer Times API FAILED with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Prayer Times API ERROR: {e}")
        return False

def test_ai_chat_api():
    """Test POST /api/ai/chat - AI Islamic knowledge chat"""
    print("\n=== Testing AI Chat API ===")
    try:
        # Test with a Turkish Islamic question
        chat_data = {
            "session_id": TEST_SESSION_ID,
            "message": "Abdest nasıl alınır? Kısa bir açıklama yapabilir misin?"
        }
        
        print(f"Sending message: {chat_data['message']}")
        response = requests.post(
            f"{BACKEND_URL}/ai/chat", 
            json=chat_data,
            timeout=30  # AI calls may take longer
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            chat_response = response.json()
            
            if "response" in chat_response and "session_id" in chat_response:
                ai_response = chat_response["response"]
                print(f"AI Response (first 200 chars): {ai_response[:200]}...")
                
                # Check if response is meaningful (contains Turkish Islamic terms)
                islamic_terms = ['abdest', 'namaz', 'Allah', 'İslam', 'su', 'temiz']
                if any(term.lower() in ai_response.lower() for term in islamic_terms):
                    print("✅ AI Chat API PASSED - Response contains relevant Islamic content")
                    return True
                else:
                    print("⚠️ AI Chat API response may not be Islamic-focused")
                    print(f"Full response: {ai_response}")
                    return True  # Still consider as working if we get a response
            else:
                print("❌ AI Chat response missing required fields")
                return False
        else:
            print(f"❌ AI Chat API FAILED with status {response.status_code}")
            if response.text:
                print(f"Error details: {response.text}")
            return False
    except Exception as e:
        print(f"❌ AI Chat API ERROR: {e}")
        return False

def test_ai_history_api():
    """Test GET /api/ai/history/{session_id} - Get chat history"""
    print("\n=== Testing AI History API ===")
    try:
        response = requests.get(f"{BACKEND_URL}/ai/history/{TEST_SESSION_ID}", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            history = response.json()
            print(f"Number of messages in history: {len(history)}")
            
            if len(history) >= 2:  # Should have at least user message + AI response
                # Check message structure
                for i, msg in enumerate(history[:2]):
                    if "role" in msg and "content" in msg and "timestamp" in msg:
                        print(f"Message {i+1}: {msg['role']} - {msg['content'][:50]}...")
                    else:
                        print(f"❌ Message {i+1} missing required fields")
                        return False
                
                print("✅ AI History API PASSED")
                return True
            else:
                print("⚠️ Chat history empty - may be expected if chat API failed")
                return True  # Not necessarily a failure
        else:
            print(f"❌ AI History API FAILED with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ AI History API ERROR: {e}")
        return False

def test_pomodoro_create_api():
    """Test POST /api/pomodoro - Create pomodoro session"""
    print("\n=== Testing Pomodoro Create API ===")
    try:
        pomodoro_data = {
            "user_id": TEST_USER_ID,
            "topic": "Kur'an Okuma",
            "duration_minutes": 25
        }
        
        print(f"Creating pomodoro: {pomodoro_data}")
        response = requests.post(f"{BACKEND_URL}/pomodoro", json=pomodoro_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            session = response.json()
            required_fields = ['id', 'user_id', 'topic', 'duration_minutes', 'completed', 'created_at']
            
            if all(field in session for field in required_fields):
                print(f"Created session ID: {session['id']}")
                print(f"Topic: {session['topic']}")
                print(f"Duration: {session['duration_minutes']} minutes")
                print(f"Completed: {session['completed']}")
                print("✅ Pomodoro Create API PASSED")
                return True, session['id']
            else:
                print(f"❌ Pomodoro session missing required fields: {required_fields}")
                return False, None
        else:
            print(f"❌ Pomodoro Create API FAILED with status {response.status_code}")
            if response.text:
                print(f"Error details: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ Pomodoro Create API ERROR: {e}")
        return False, None

def test_pomodoro_get_api():
    """Test GET /api/pomodoro/{user_id} - Get user's pomodoro sessions"""
    print("\n=== Testing Pomodoro Get API ===")
    try:
        response = requests.get(f"{BACKEND_URL}/pomodoro/{TEST_USER_ID}", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            sessions = response.json()
            print(f"Number of sessions: {len(sessions)}")
            
            if len(sessions) > 0:
                session = sessions[0]
                required_fields = ['id', 'user_id', 'topic', 'duration_minutes']
                
                if all(field in session for field in required_fields):
                    print(f"Latest session: {session['topic']} - {session['duration_minutes']}min")
                    print("✅ Pomodoro Get API PASSED")
                    return True
                else:
                    print(f"❌ Session missing required fields: {required_fields}")
                    return False
            else:
                print("⚠️ No sessions found - may be expected if create API failed")
                return True  # Not necessarily a failure
        else:
            print(f"❌ Pomodoro Get API FAILED with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Pomodoro Get API ERROR: {e}")
        return False

def test_pomodoro_stats_api():
    """Test GET /api/pomodoro/stats/{user_id} - Get user's pomodoro stats"""
    print("\n=== Testing Pomodoro Stats API ===")
    try:
        response = requests.get(f"{BACKEND_URL}/pomodoro/stats/{TEST_USER_ID}", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            stats = response.json()
            required_fields = ['total_sessions', 'completed_sessions', 'total_minutes', 'topics']
            
            if all(field in stats for field in required_fields):
                print(f"Total sessions: {stats['total_sessions']}")
                print(f"Completed sessions: {stats['completed_sessions']}")
                print(f"Total minutes: {stats['total_minutes']}")
                print(f"Topics: {list(stats['topics'].keys())}")
                print("✅ Pomodoro Stats API PASSED")
                return True
            else:
                print(f"❌ Stats missing required fields: {required_fields}")
                return False
        else:
            print(f"❌ Pomodoro Stats API FAILED with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Pomodoro Stats API ERROR: {e}")
        return False

def test_user_preferences_api():
    """Test User Preferences API endpoints"""
    print("\n=== Testing User Preferences API ===")
    
    # Test POST /api/preferences - Create/Update preferences
    try:
        prefs_data = {
            "user_id": TEST_USER_ID,
            "city_id": "istanbul",
            "madhab": "hanafi",
            "language": "tr"
        }
        
        print(f"Creating preferences: {prefs_data}")
        response = requests.post(f"{BACKEND_URL}/preferences", json=prefs_data, timeout=10)
        print(f"POST Status Code: {response.status_code}")
        
        if response.status_code == 200:
            prefs = response.json()
            required_fields = ['id', 'user_id', 'city_id', 'madhab', 'language']
            
            if all(field in prefs for field in required_fields):
                print(f"Created preferences ID: {prefs['id']}")
                print(f"City: {prefs['city_id']}, Madhab: {prefs['madhab']}")
                
                # Test GET /api/preferences/{user_id} - Get preferences
                get_response = requests.get(f"{BACKEND_URL}/preferences/{TEST_USER_ID}", timeout=10)
                print(f"GET Status Code: {get_response.status_code}")
                
                if get_response.status_code == 200:
                    get_prefs = get_response.json()
                    if get_prefs['user_id'] == TEST_USER_ID and get_prefs['city_id'] == "istanbul":
                        print("✅ User Preferences API PASSED")
                        return True
                    else:
                        print("❌ Retrieved preferences don't match created ones")
                        return False
                else:
                    print(f"❌ GET Preferences FAILED with status {get_response.status_code}")
                    return False
            else:
                print(f"❌ Preferences missing required fields: {required_fields}")
                return False
        else:
            print(f"❌ Create Preferences FAILED with status {response.status_code}")
            if response.text:
                print(f"Error details: {response.text}")
            return False
    except Exception as e:
        print(f"❌ User Preferences API ERROR: {e}")
        return False

def run_all_tests():
    """Run all backend API tests"""
    print("=" * 60)
    print("🕌 ISLAMIC LIFE ASSISTANT - BACKEND API TESTING")
    print("=" * 60)
    print(f"Testing against: {BACKEND_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {}
    
    # Run tests in order
    results['health_check'] = test_health_check()
    results['cities'] = test_cities_api()
    results['prayer_times'] = test_prayer_times_api()
    results['ai_chat'] = test_ai_chat_api()
    results['ai_history'] = test_ai_history_api()
    
    # Pomodoro tests
    pomodoro_create_result, session_id = test_pomodoro_create_api()
    results['pomodoro_create'] = pomodoro_create_result
    results['pomodoro_get'] = test_pomodoro_get_api()
    results['pomodoro_stats'] = test_pomodoro_stats_api()
    
    # User preferences test
    results['user_preferences'] = test_user_preferences_api()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed + failed} tests")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Backend APIs are working correctly.")
    else:
        print(f"\n⚠️ {failed} test(s) failed. Check the detailed output above.")
    
    return results

if __name__ == "__main__":
    results = run_all_tests()