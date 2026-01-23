import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';

// Schema for course intro video data
export const CourseIntroSchema = z.object({
	title: z.string(),
	instructorName: z.string(),
	instructorTitle: z.string(),
	duration: z.string(),
	level: z.string(),
	category: z.string(),
	thumbnailUrl: z.string().optional(),
	branding: z.object({
		primaryColor: z.string(),
		secondaryColor: z.string(),
		logoUrl: z.string().optional(),
	}).optional(),
});

type CourseIntroProps = z.infer<typeof CourseIntroSchema>;

// Individual animation components
const AnimatedTitle: React.FC<{title: string; delay: number}> = ({title, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 20},
	});
	
	const translateY = interpolate(
		frame - delay,
		[0, 15],
		[50, 0],
		{extrapolateRight: 'clamp'}
	);
	
	return (
		<div
			style={{
				opacity,
				transform: `translateY(${translateY}px)`,
				fontSize: '72px',
				fontWeight: 'bold',
				color: '#ffffff',
				textAlign: 'center',
				marginBottom: '20px',
				lineHeight: '1.2',
			}}
		>
			{title}
		</div>
	);
};

const AnimatedSubtitle: React.FC<{text: string; delay: number}> = ({text, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 20},
	});
	
	return (
		<div
			style={{
				opacity,
				fontSize: '32px',
				color: '#e5e7eb',
				textAlign: 'center',
				marginBottom: '16px',
			}}
		>
			{text}
		</div>
	);
};

const CourseInfoCard: React.FC<{
	duration: string;
	level: string;
	category: string;
	delay: number;
}> = ({duration, level, category, delay}) => {
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
	
	return (
		<div
			style={{
				opacity,
				transform: `scale(${scale})`,
				background: 'rgba(255, 255, 255, 0.1)',
				backdropFilter: 'blur(10px)',
				borderRadius: '20px',
				padding: '30px',
				border: '1px solid rgba(255, 255, 255, 0.2)',
				display: 'flex',
				gap: '40px',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div style={{textAlign: 'center'}}>
				<div style={{fontSize: '18px', color: '#9ca3af', marginBottom: '8px'}}>Duration</div>
				<div style={{fontSize: '24px', fontWeight: 'bold', color: '#ffffff'}}>{duration}</div>
			</div>
			<div style={{textAlign: 'center'}}>
				<div style={{fontSize: '18px', color: '#9ca3af', marginBottom: '8px'}}>Level</div>
				<div style={{fontSize: '24px', fontWeight: 'bold', color: '#ffffff'}}>{level}</div>
			</div>
			<div style={{textAlign: 'center'}}>
				<div style={{fontSize: '18px', color: '#9ca3af', marginBottom: '8px'}}>Category</div>
				<div style={{fontSize: '24px', fontWeight: 'bold', color: '#ffffff'}}>{category}</div>
			</div>
		</div>
	);
};

const AnimatedBackground: React.FC<{primaryColor?: string}> = ({primaryColor = '#4f46e5'}) => {
	const frame = useCurrentFrame();
	
	const gradientRotation = interpolate(frame, [0, 300], [0, 360]);
	
	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(${gradientRotation}deg, ${primaryColor}, #7c3aed, #ec4899)`,
			}}
		/>
	);
};

const ParticleEffect: React.FC = () => {
	const frame = useCurrentFrame();
	
	const particles = Array.from({length: 20}, (_, i) => {
		const delay = i * 5;
		const opacity = spring({
			frame: frame - delay,
			fps: 30,
			config: {damping: 10},
		});
		
		const x = interpolate(
			frame - delay,
			[0, 100],
			[Math.random() * 1920, Math.random() * 1920],
			{extrapolateRight: 'clamp'}
		);
		
		const y = interpolate(
			frame - delay,
			[0, 100],
			[Math.random() * 1080, Math.random() * 1080],
			{extrapolateRight: 'clamp'}
		);
		
		return (
			<div
				key={i}
				style={{
					position: 'absolute',
					left: x,
					top: y,
					width: '4px',
					height: '4px',
					backgroundColor: 'rgba(255, 255, 255, 0.8)',
					borderRadius: '50%',
					opacity: opacity * 0.6,
				}}
			/>
		);
	});
	
	return <>{particles}</>;
};

// Main Course Intro Video Component
export const CourseIntroVideo: React.FC<CourseIntroProps> = ({
	title,
	instructorName,
	instructorTitle,
	duration,
	level,
	category,
	branding,
}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0f172a', overflow: 'hidden'}}>
			{/* Animated Background */}
			<AnimatedBackground primaryColor={branding?.primaryColor} />
			
			{/* Particle Effects */}
			<ParticleEffect />
			
			{/* Content Container */}
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '80px',
				}}
			>
				{/* Course Title */}
				<AnimatedTitle title={title} delay={0} />
				
				{/* Instructor Info */}
				<AnimatedSubtitle text={`with ${instructorName}`} delay={15} />
				<AnimatedSubtitle text={instructorTitle} delay={25} />
				
				{/* Course Info Card */}
				<CourseInfoCard
					duration={duration}
					level={level}
					category={category}
					delay={40}
				/>
				
				{/* Call to Action */}
				<div
					style={{
						opacity: spring({
							frame: useCurrentFrame() - 70,
							fps: 30,
							config: {damping: 20},
						}),
						marginTop: '40px',
					}}
				>
					<div
						style={{
							backgroundColor: branding?.primaryColor || '#4f46e5',
							color: '#ffffff',
							padding: '16px 40px',
							borderRadius: '50px',
							fontSize: '24px',
							fontWeight: 'bold',
							border: 'none',
							cursor: 'pointer',
							boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)',
						}}
					>
						Start Learning Today
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};