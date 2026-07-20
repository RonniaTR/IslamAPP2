const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// AI Recommendation Engine Trigger
exports.updateRecommendations = functions.firestore
  .document('history/{historyId}')
  .onWrite(async (change, context) => {
    // Only run if the document was created or updated
    if (!change.after.exists) return null;
    
    const historyData = change.after.data();
    const userId = historyData.userId;
    
    if (!userId) return null;

    console.log(`Updating recommendations for user: ${userId}`);

    try {
      // 1. Get user's recent history
      const historySnapshot = await db.collection('history')
        .where('userId', '==', userId)
        .orderBy('lastAccessedAt', 'desc')
        .limit(10)
        .get();

      if (historySnapshot.empty) return null;

      // 2. Extract favorite tags from recently viewed content
      const contentIds = historySnapshot.docs.map(doc => doc.data().contentId);
      
      const tags = new Set();
      for (const id of contentIds) {
        // Fetch article/lesson to get its tags
        const articleDoc = await db.collection('articles').doc(id).get();
        if (articleDoc.exists) {
          const articleData = articleDoc.data();
          if (articleData.tags && Array.isArray(articleData.tags)) {
            articleData.tags.forEach(t => tags.add(t));
          }
        }
      }

      const favoriteTags = Array.from(tags);
      if (favoriteTags.length === 0) return null;

      // 3. Find content that matches these tags but the user hasn't seen yet
      const recommendationsSnapshot = await db.collection('articles')
        .where('status', '==', 'published')
        .where('tags', 'array-contains-any', favoriteTags)
        .limit(20)
        .get();

      const newRecommendations = [];
      recommendationsSnapshot.forEach(doc => {
        if (!contentIds.includes(doc.id)) {
          newRecommendations.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });

      // 4. Save to recommendations collection
      const top5 = newRecommendations.slice(0, 5);
      await db.collection('recommendations').doc(userId).set({
        items: top5,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Generated ${top5.length} recommendations for user ${userId}`);
      return true;

    } catch (error) {
      console.error('Error generating recommendations:', error);
      return null;
    }
  });

// XP and Level Calculation Trigger
exports.calculateXP = functions.firestore
  .document('history/{historyId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Check if content was just completed
    if (!beforeData.isCompleted && afterData.isCompleted) {
      const userId = afterData.userId;
      
      try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        
        let currentXP = 0;
        if (userDoc.exists && userDoc.data().xp) {
          currentXP = userDoc.data().xp;
        }

        // Add 50 XP for completing content
        const newXP = currentXP + 50;
        const newLevel = Math.floor(newXP / 1000) + 1;

        await userRef.set({
          xp: newXP,
          level: newLevel,
          lastActivityAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`User ${userId} earned 50 XP. Total: ${newXP}, Level: ${newLevel}`);
        return true;
      } catch (error) {
        console.error('Error updating XP:', error);
        return null;
      }
    }
    return null;
  });
