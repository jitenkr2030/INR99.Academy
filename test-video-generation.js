#!/usr/bin/env node

/**
 * Test script for video generation API endpoints
 * Run this script to test the video generation functionality
 */

const API_BASE = 'http://localhost:3000/api/video-generation';

// Test data for different video types
const testData = {
	courseIntro: {
		title: 'Complete Web Development Bootcamp',
		instructorName: 'John Doe',
		instructorTitle: 'Senior Web Developer',
		duration: '40 hours',
		level: 'Beginner',
		category: 'Programming',
		branding: {
			primaryColor: '#4f46e5',
			secondaryColor: '#7c3aed',
		},
	},
	lessonPreview: {
		lessonTitle: 'Introduction to HTML & CSS',
		lessonNumber: 1,
		duration: '45 minutes',
		keyTopics: ['HTML Basics', 'CSS Fundamentals', 'Web Structure', 'Responsive Design'],
		courseTitle: 'Complete Web Development Bootcamp',
		instructorName: 'John Doe',
		branding: {
			primaryColor: '#4f46e5',
			secondaryColor: '#7c3aed',
		},
	},
	courseThumbnail: {
		title: 'Complete Web Development Bootcamp',
		instructorName: 'John Doe',
		level: 'Beginner',
		duration: '40 hours',
		studentCount: 15000,
		rating: 4.8,
		category: 'Programming',
		branding: {
			primaryColor: '#4f46e5',
			secondaryColor: '#7c3aed',
		},
	},
};

async function testVideoGeneration() {
	console.log('🎬 Testing Video Generation API...\n');

	// Test Course Intro Video
	console.log('📚 Testing Course Intro Video Generation...');
	try {
		const response = await fetch(`${API_BASE}/course-intro`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(testData.courseIntro),
		});

		const result = await response.json();
		
		if (result.success) {
			console.log('✅ Course Intro Video Generated Successfully!');
			console.log(`   Video URL: ${result.videoUrl}`);
			console.log(`   File Size: ${(result.metadata.fileSize / 1024 / 1024).toFixed(2)} MB`);
		} else {
			console.log('❌ Course Intro Video Generation Failed:', result.message);
		}
	} catch (error) {
		console.log('❌ Course Intro Video Generation Error:', error.message);
	}

	console.log('\n' + '='.repeat(50) + '\n');

	// Test Lesson Preview Video
	console.log('🎥 Testing Lesson Preview Video Generation...');
	try {
		const response = await fetch(`${API_BASE}/lesson-preview`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(testData.lessonPreview),
		});

		const result = await response.json();
		
		if (result.success) {
			console.log('✅ Lesson Preview Video Generated Successfully!');
			console.log(`   Video URL: ${result.videoUrl}`);
			console.log(`   File Size: ${(result.metadata.fileSize / 1024 / 1024).toFixed(2)} MB`);
		} else {
			console.log('❌ Lesson Preview Video Generation Failed:', result.message);
		}
	} catch (error) {
		console.log('❌ Lesson Preview Video Generation Error:', error.message);
	}

	console.log('\n' + '='.repeat(50) + '\n');

	// Test Course Thumbnail Video
	console.log('🖼️ Testing Course Thumbnail Video Generation...');
	try {
		const response = await fetch(`${API_BASE}/course-thumbnail`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(testData.courseThumbnail),
		});

		const result = await response.json();
		
		if (result.success) {
			console.log('✅ Course Thumbnail Video Generated Successfully!');
			console.log(`   Video URL: ${result.videoUrl}`);
			console.log(`   File Size: ${(result.metadata.fileSize / 1024 / 1024).toFixed(2)} MB`);
		} else {
			console.log('❌ Course Thumbnail Video Generation Failed:', result.message);
		}
	} catch (error) {
		console.log('❌ Course Thumbnail Video Generation Error:', error.message);
	}

	console.log('\n' + '='.repeat(50) + '\n');

	// Test Batch Video Generation
	console.log('🔄 Testing Batch Video Generation...');
	try {
		const batchData = {
			jobs: [
				{
					type: 'course-intro',
					data: {
						...testData.courseIntro,
						title: 'Advanced React Development',
					},
				},
				{
					type: 'lesson-preview',
					data: {
						...testData.lessonPreview,
						lessonTitle: 'React Hooks Deep Dive',
						lessonNumber: 1,
					},
				},
				{
					type: 'course-thumbnail',
					data: {
						...testData.courseThumbnail,
						title: 'Advanced React Development',
					},
				},
			],
		};

		const response = await fetch(`${API_BASE}/batch`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(batchData),
		});

		const result = await response.json();
		
		if (result.success) {
			console.log('✅ Batch Video Generation Completed Successfully!');
			console.log(`   Total Jobs: ${result.summary.totalJobs}`);
			console.log(`   Successful: ${result.summary.successfulJobs}`);
			console.log(`   Total File Size: ${(result.summary.totalFileSize / 1024 / 1024).toFixed(2)} MB`);
			
			result.results.forEach((videoResult, index) => {
				console.log(`   ${index + 1}. ${videoResult.type}: ${videoResult.videoUrl}`);
			});
		} else {
			console.log('❌ Batch Video Generation Failed:', result.message);
		}
	} catch (error) {
		console.log('❌ Batch Video Generation Error:', error.message);
	}

	console.log('\n🎉 Video Generation API Testing Complete!');
	console.log('\n📝 Next Steps:');
	console.log('1. Start your development server: bun run dev');
	console.log('2. Visit: http://localhost:3000/dashboard/instructor/video-generation');
	console.log('3. Use the dashboard to create custom videos');
	console.log('4. Check the generated videos in: public/videos/');
}

// Check if server is running
async function checkServer() {
	try {
		const response = await fetch('http://localhost:3000/api/video-generation/course-intro', {
			method: 'GET',
		});
		return true;
	} catch (error) {
		return false;
	}
}

// Main execution
async function main() {
	const serverRunning = await checkServer();
	
	if (!serverRunning) {
		console.log('❌ Development server is not running!');
		console.log('Please start the server with: bun run dev');
		process.exit(1);
	}

	await testVideoGeneration();
}

// Run the test
main().catch(console.error);