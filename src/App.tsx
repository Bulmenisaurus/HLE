import { h } from 'preact';
import AppContent from './AppContent';

export default function App() {
    return (
        <div id='root'>
            <nav>
                <h1>Are you smarter than a frontier model?</h1>
            </nav>
            <div id='container'>
                <AppContent />
            </div>
        </div>
    );
}
