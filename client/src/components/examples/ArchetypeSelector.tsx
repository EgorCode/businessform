import ArchetypeSelector from '../ArchetypeSelector';

export default function ArchetypeSelectorExample() {
  return <ArchetypeSelector onSelect={(id) => console.log('Selected:', id)} />;
}
