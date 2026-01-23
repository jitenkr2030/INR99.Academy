import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Sequence,
} from 'remotion';
import {z} from 'zod';

// Schema for lesson preview video data
export const LessonPreviewSchema = z.object({
	lessonTitle: z.string(),
	lessonNumber: z.number(),
	duration: z.string(),
	keyTopics: z.array(z.string()),
	courseTitle: z.string(),
	instructorName: z.string(),
	thumbnailUrl: z.string().optional(),
	branding: z.object({
		primaryColor: z.string(),
		secondaryColor: z.string(),
	}).optional(),
});

type LessonPreviewProps = z.infer<typeof LessonPreviewSchema>;

// Animated components
const SlideInText: React.FC<{
	text: string;
	delay: number;
	duration?: number;
	fontSize?: string;
	color?: string;
}> = ({text, delay, duration = 30, fontSize = '48px', color = '#ffffff'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const progress = interpolate(frame - delay, [0, duration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	
	const translateX = interpolate(progress, [0, 1], [-100, 0]);
	const opacity = progress < 0.1 ? 0 : progress;
	
	return (
		<div
			style={{
				transform: `translateX(${translateX}%)`,
				opacity,
				fontSize,
				fontWeight: 'bold',
				color,
				marginBottom: '20px',
			}}
		>
			{text}
		</div>
	);
};

const TopicBubble: React.FC<{
	topic: string;
	delay: number;
	index: number;
	primaryColor?: string;
}> = ({topic, delay, index, primaryColor = '#4f46e5'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const scale = spring({
		frame: frame - delay,
		fps,
		config: {mass: 1, damping: 15, stiffness: 100},
	});
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 20},
	});
	
	const colors = [primaryColor, '#7c3aed', '#ec4899', '#f59e0b', '#10b981'];
	const bgColor = colors[index % colors.length];
	
	return (
		<div
			style={{
				opacity,
				transform: `scale(${scale})`,
				backgroundColor: bgColor,
				color: '#ffffff',
				padding: '12px 24px',
				borderRadius: '25px',
				fontSize: '18px',
				fontWeight: '600',
				margin: '8px',
				display: 'inline-block',
				boxShadow: `0 4px 15px ${bgColor}40`,
			}}
		>
			{topic}
		</div>
	);
};

const LessonInfoCard: React.FC<{
	lessonNumber: number;
	duration: string;
	instructorName: string;
	delay: number;
	primaryColor?: string;
}> = ({lessonNumber, duration, instructorName, delay, primaryColor = '#4f46e5'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const slideIn = spring({
		frame: frame - delay,
		fps,
		config: {damping: 20},
	});
	
	const translateY = interpolate(slideIn, [0, 1], [100, 0]);
	
	return (
		<div
			style={{
				transform: `translateY(${translateY}px)`,
				background: 'rgba(255, 255, 255, 0.1)',
				backdropFilter: 'blur(10px)',
				borderRadius: '16px',
				padding: '24px',
				border: `2px solid ${primaryColor}`,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				minWidth: '600px',
			}}
		>
			<div>
				<div style={{fontSize: '16px', color: '#9ca3af', marginBottom: '4px'}}>
					Lesson {lessonNumber}
				</div>
				<div style={{fontSize: '20px', fontWeight: 'bold', color: '#ffffff'}}>
					{duration}
				</div>
			</div>
			<div style={{textAlign: 'right'}}>
				<div style={{fontSize: '14px', color: '#9ca3af', marginBottom: '4px'}}>
					Instructor
				</div>
				<div style={{fontSize: '18px', fontWeight: 'bold', color: '#ffffff'}}>
					{instructorName}
				</div>
			</div>
		</div>
	);
};

const AnimatedBackgroundPattern: React.FC<{primaryColor?: string}> = ({primaryColor = '#4f46e5'}) => {
	const frame = useCurrentFrame();
	
	const patternOffset = interpolate(frame, [0, 180], [0, 100]);
	
	return (
		<AbsoluteFill
			style={{
				background: `
					linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%),
					repeating-linear-gradient(
						45deg,
						transparent,
						transparent 20px,
						${primaryColor}20 20px,
						${primaryColor}20 40px
					)
				`,
				backgroundSize: '100% 100%, 60px 60px',
				backgroundPosition: `0 0, ${patternOffset}px ${patternOffset}px`,
			}}
		/>
	);
};

const PulsingCircle: React.FC<{delay: number; color?: string}> = ({delay, color = '#4f46e5'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const scale = spring({
		frame: frame - delay,
		fps,
		config: {mass: 2, damping: 10, stiffness: 50},
	});
	
	const opacity = interpolate(scale, [0, 1], [0.8, 0.2]);
	
	return (
		<div
			style={{
				position: 'absolute',
				width: '300px',
				height: '300px',
				borderRadius: '50%',
				border: `3px solid ${color}`,
				opacity,
				transform: `scale(${scale})`,
				top: '50%',
				left: '50%',
				marginLeft: '-150px',
				marginTop: '-150px',
			}}
		/>
	);
};

// Main Lesson Preview Video Component
export const LessonPreviewVideo: React.FC<LessonPreviewProps> = ({
	lessonTitle,
	lessonNumber,
	duration,
	keyTopics,
	courseTitle,
	instructorName,
	branding,
}) => {
	const primaryColor = branding?.primaryColor || '#4f46e5';
	
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{/* Background */}
			<AnimatedBackgroundPattern primaryColor={primaryColor} />
			
			{/* Decorative Elements */}
			<PulsingCircle delay={0} color={primaryColor} />
			<PulsingCircle delay={15} color={branding?.secondaryColor || '#7c3aed'} />
			
			{/* Content */}
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '60px',
				}}
			>
				{/* Course Title */}
				<Sequence from={0} durationInFrames={60}>
					<div
						style={{
							fontSize: '24px',
							color: '#9ca3af',
							marginBottom: '20px',
							textAlign: 'center',
						}}
					>
						{courseTitle}
					</div>
				</Sequence>
				
				{/* Lesson Title */}
				<SlideInText text={lessonTitle} delay={10} fontSize="56px" />
				
				{/* Lesson Info Card */}
				<Sequence from={30} durationInFrames={150}>
					<LessonInfoCard
						lessonNumber={lessonNumber}
						duration={duration}
						instructorName={instructorName}
						delay={0}
						primaryColor={primaryColor}
					/>
				</Sequence>
				
				{/* Key Topics */}
				<Sequence from={50} durationInFrames={130}>
					<div style={{marginTop: '40px', textAlign: 'center'}}>
						<div
							style={{
								fontSize: '28px',
								fontWeight: 'bold',
								color: '#ffffff',
								marginBottom: '24px',
							}}
						>
							What You'll Learn
						</div>
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								justifyContent: 'center',
								maxWidth: '800px',
							}}
						>
							{keyTopics.map((topic, index) => (
								<TopicBubble
									key={index}
									topic={topic}
									delay={index * 10}
									index={index}
									primaryColor={primaryColor}
								/>
							))}
						</div>
					</div>
				</Sequence>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};