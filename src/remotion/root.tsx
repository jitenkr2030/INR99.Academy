import {Composition} from 'remotion';
import {CourseIntroVideo} from './compositions/CourseIntroVideo';
import {LessonPreviewVideo} from './compositions/LessonPreviewVideo';
import {CourseThumbnailVideo} from './compositions/CourseThumbnailVideo';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* Course Introduction Videos */}
			<Composition
				id="CourseIntro"
				component={CourseIntroVideo}
				durationInFrames={300} // 10 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
			/>
			
			{/* Lesson Preview Videos */}
			<Composition
				id="LessonPreview"
				component={LessonPreviewVideo}
				durationInFrames={180} // 6 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
			/>
			
			{/* Course Thumbnail Videos */}
			<Composition
				id="CourseThumbnail"
				component={CourseThumbnailVideo}
				durationInFrames={90} // 3 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};